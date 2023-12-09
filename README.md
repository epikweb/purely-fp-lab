Basic program as a value with algebraic effects + runtime exercise in js.

### Output
![](https://i.gyazo.com/6d0e3f49f2f1c1bf4323bf953b8f7d10.png)



## Takeaways

- Applicative programming (the entire program as a value) is programming at a higher level of abstraction.
  - Effects such as option link to multiple sub-programs inside the higher level program depending on the input given to it
- Imperative programming are the operations that take place during execution (create state, mutate it in a loop)
  - This is programming in a global scope
- For a large application, you essentially are writing applicative applications that are reduced to a value and threaded between eachother using the IO effect at the composition root

## References
- [Debasish Ghosh - Functional Programming patterns for designing modular abstractions](https://www.youtube.com/watch?v=e52SyaFFznI)
- [Fabio Labella - Programs as values](https://systemfw.org/posts/programs-as-values-I.html)

