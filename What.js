const liftF = (type, data) => ({ type, data })
const liftOption = (value, found, missing) => liftF('partiality', { value, found, missing })
const putState = (key, value) => liftF('putState', { key, value })
const getState = key => liftF('getState', { key })
const left = error => liftF('throwException', error)
const ask = env => liftF('read', env)
const putStrLn = (str, args) => liftF('logging', { str, args })
const sequential = (effects, outputKey) => liftF('kleisli', { effects, outputKey })
const andThen = (lhs, rhs) => liftF('continuation', { lhs, rhs })
const question = str => liftF('readStandardIn', str)
const store = (id, key, value) => liftF('databaseWrite', { id, key, value })
const query = (id, key) => liftF('databaseRead', { id, key })
const pure = value => liftF('return', value)


const showEntered = value => putStrLn(`you entered %s`, [value])
export const printNameAndAge = andThen(
  question('what is your name?'),
  name =>
    liftOption(
      name,
      name =>
        andThen(
          showEntered(name),
          _ =>
            andThen(
              question('what is your age?'),
              age =>
                liftOption(
                  age,
                  age =>
                    andThen(
                      showEntered(age),
                      _ =>
                        putStrLn('your name is %s and your age is %i', [name, age]),
                    ),
                  left('you didnt enter your age!')
                )
            )
        ),
      left('you didnt enter your name!')
    )
)