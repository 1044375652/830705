# 20190803

今天一共学了：

- 执行上下文
- 作用域
- 闭包
- this

### 执行上下文

  当函数执行的时候，会创建一个称为执行上下文的环境，他有两个阶段：1：创建阶段；2：执行阶段。

  #### 创建阶段

  在函数执行之前，会预先准备一个拥有三个属性的对象

```html
executionContext = {
	scopeChain : {},//作用域链
	variableObject : {},//初始化变量，函数，形参
	this : {}//指定this
}
```

#### 执行阶段

  函数执行的主要任务是1：分配变量；2：函数引用。赋值。3：执行代码

  所以这就出现了我们口中的变量提升的说法。下面来道面试题（曾经掉入的坑）

```javascript
console.log(a);//打印出来的是undefined
var a = 123;
//这就是因为在函数执行的时候，会先创建一个下上文对象，然后做了一些底层工作（就是我们口中变量提升），导致打印出来的是undefined
```

  另一道题

```javascript
console.log(a);//报错,a未定义
```

### 执行上下文栈

  讲到执行上下文，就不得不提执行上下文栈

  举个例子：

```javascript
function c(){
	console.log('ok');
}
function a(){
	function b(){
		c();
	}
	b();
}
a();
```

```javascript
以上函数的执行上下文栈是这样的
|        |  =>  |        |  =>  |        | =>  |   c()  |  
|        |  =>  |        |  =>  |   b()  | =>  |   b()  |  
|        |  =>  |   a()  |  =>  |   a()  | =>  |   a()  |  
| window |  =>  | window |  =>  | window | =>  | window |
----------      ----------      ----------     ----------
//首先，一开始，上下文就是window,当遇到了a执行，就把a塞入我们的上下文栈，同理，遇到b,c执行的时候，就分别塞入上下文栈；
//这里有个小细节，就是作用域与执行上下文栈不是必然的关系。作用域是与定义栈才有关系,举个例子
function outer () {
	var person = "outer";
	return function inner () {
		console.log("person",person);
	}
	inner();
}

var inner = outer();

function exection () {
	var person = "exection";
	inner();
}

exection();
//最终打印出来的是persion outer
//如果不信的话，可以把func outer里面的person去掉，那么程序就会报错
```



### 作用域

  在ES5及之前，只拥有全局作用域与函数作用域，到了ES6，便增加了块级作用域



### 闭包

  个人感觉，就是把自己某些东西暴露给外界，使得原本外界不可以访问的东西，通过我暴露之后，就可以访问了。



### this

判断this通常用三招（大部分情况下可以解决）

- 没有通过打点调用的，就是window
- 谁打点调用的，就是指向谁
- 谁new出来的，就是谁

我们页拥有四种种手段来强制改变this

- apply  - 与call没什么区别，就是传参不同
- call  - 与apply没什么区别，就是传参不同
- bind  - 与上述没什么区别，就是返回的是函数的引用，必须还得自己执行一次
- 箭头函数  - 箭头函数的this是跟他外面的this相同的