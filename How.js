import {printNameAndAge} from "./What.js";
import rl from 'readline/promises'
let how = {
  continuation: ({ lhs, rhs }) => F => {
    F.ask(
      lhs,
      answer => {
        F.ask(
          rhs(answer),
          F.answer
        )
      }
    )
  },
  readStandardIn: str => F => {
    let pipe = rl.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    pipe.question(str).then(answer => {
      pipe.close()
      F.answer(answer)
    })
      .catch(F.raiseError)
  },
  partiality: ({ value, found, missing }) => F => {
    if ([null, undefined, ''].includes(value)) {
      F.ask(missing, F.answer)
    } else {
      F.ask(found(value), F.answer)
    }
  },
  fold: ({ list, f, zero }) => F => {
    let fold = 'fold'
    let iterator = 'iterator'
    F.put(fold, structuredClone(zero))
    F.put(iterator, 0);

    (function loop() {
      let i = F.get(iterator)
      if (i === list.length) {
        F.answer(F.get(fold))
      } else {
        F.ask(
          f(F.get(fold), list[i], i),
          answer => {
            F.put(fold, answer)
            F.put(iterator, iterator + 1)
            loop()
          }
        )
      }
    })()
  },
  logging: ({ str, args }) => F => {
    console.log(str, ...args)
    F.answer(1)
  },
  throwException: message => F => {
    F.raiseError(message)
  }
}
let unsafeRunSync = (what, err, ok) => {
  let ask = (effect, answer) => {
    let heap = {};
    console.group('<-', effect.type, effect.data)
    let f = how[effect.type]
    if (!f) {
      err(`Missing effect handler ${effect.type}`)
      return
    }
    f(effect.data)({
      ask,
      answer: value => {
        console.log('->', value)
        console.groupEnd()
        answer(value)
      },
      put: (k, v) => {
        heap[k] = v
        console.log(k, '<-', v)
      },
      get: () => heap,
      raiseError: err
    })
  }
  ask(what, ok)
}
unsafeRunSync(
  printNameAndAge,
  console.error,
  console.log
)