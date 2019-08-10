## 面对对象

在JS中，我们创建对象的方法有

- 工厂模式
- 构造函数模式
- 原型模式
- 组合模式

### 工厂模式

个人理解，就是定义一个函数，然后在里面进行各种骚操作，最后返回一个对象给你

### 构造函数模式

也是先定义一个函数，不过想要他返回一个对象给你的话，就必须通过new调用

- 好处
  - 每个对象都有自己独特的属性
- 坏处
  - 每个对象都有自己的方法，但很经常的是，对象都会调用公共的方法，没有必要有自己独特的方法，浪费资源

### 原型模式

和构造函数模式很像，不过，原型模式把对象的属性以及方法，都挂在prototype上了。

- 好处
  - 每个对象都共用同一个方法，不会浪费空间
- 坏处
  - 每个对象都共用一个属性，当改变一个引用类型的属性的时候，会导致所有拥有该属性的对象都会改变

### 组合模式

组合模式结合了构造函数模式和原型模式的优点，去除了他们的缺点。即：每个对象都有自己独特的属性，但是，方法却是公共的。

## new操作符

我们在new一个对象的时候，干了什么？

- 创建一个新对象
- 把构造函数的作用域指向该对象
- 执行函数的剩余代码
- 返回新对象

## 原型链

当我们创建一个函数的时候，浏览器会帮我们创建一个属性，叫prototype，而这个prototype指向一个对象，这个对象叫原型对象。

当我们创建一个新对象的时候，想要读取对象中某个属性，如果找到，则返回。如果没有找到，则去原型对象上找，如果原型对象没有，就去原型对象的原型对象上去找，一直到Object为止，这种现象叫做原型链。（个人感觉和作用域链很像，自己没有，就去父级找，父级没有，就去父级的父级）

## 继承

- 原型链继承
- 构造函数继承
- 组合继承
- 寄生继承
- class

### 原型链继承

```javascript
function Body () {
	this.a = 1;
	this.b = 2;
}
function Test () {
	
}
Test.prototype = new Body();
var test = new Test();
var test2 = new Test();
console.log(test.a);
console.log(test.b);
```

原型链继承，顾名思义，就是利用原型链，来完成继承。以上代码，就是把Test的prototype指向Body的一个实例，导致所有的Test实例都会拥有Body的属性，这就完成了继承。看到这里，心中就有一个想法，涉及到原型，就避免不了共享，当Test其中一个实例改变了Body实例上的属性的时候，其他对象都会被影响到。

### 构造函数继承

```javascript
function Body () {
	this.a = 1;
	this.b = 2;
}

Body.prototype.test = function () {};

function Test () {
	console.log(this);
	Body.call(this);	
}

var test = new Test();
```

顾名思义，就是利用构造函数来完成继承，只不过这个构造函数是别人的构造函数而已。

还记不记得，可以通过call，apply，bind来改变this的指向，所以，我们可以调用别人的构造函数，只不过改变了一下this的指向，就完成了继承，但是，这种方法有个缺点，就是别人构造函数的prototype的东西我们无法继承，为什么？

因为我们的原型链并没有指向别人的原型链。什么意思呢？就是Body.prototype.test，是给Body的实例准备的，虽然我们通过Body.call(this)，借用Body的构造函数来继承来，但是这个this，还是Test的this啊，Test的prototype并没有绑定相关的方法，找不到也就不奇怪了

### 组合继承

这种继承，结合了原型链继承和构造函数继承的优点，去掉了他们的缺点。

```javascript
(function () {
	function Body () {
		this.a = 1;
		this.b = 2;
	}

	function Test () {
		Body.call(this);	
	}

	Body.prototype.test = function () {}


	Test.prototype = new Body();

	var test = new Test();
	console.log(test);	
})();
```

组合模式和原型链模式都有一个缺点，就是我不知道什么时候传参。什么意思呢？就是，假设啊，我们Body函数的a属性，是根据参数动态确定的。可是呢，我们在指定原型对象的时候，就new了一下Body，但是，我们new Test对象的却在下面，就导致我们不知道什么时候传参，以及该怎么传参。

### 寄生式继承

寄生式继承就是为了解决何时可以传参的问题

```javascript
(function () {
	function Body () {
		this.a = 1;
		this.b = 2;
	}

	Body.prototype.test = function () {};

	function Test () {
		Body.call(this);
	}

	Test.prototype = Body.prototype;

	var test = new Test();

	console.log(test);

})();
```

但是，这就有个问题哦，你直接把Test.prototype与Body.prototype关联了起来，那你改变了Test.prototype，就会改变到Body.prototype，并且，你都直接关联起来了，咋不直接用Body呢？

于是，又改进了一下

```javascript
(function () {
	function Body () {
		this.a = 1;
		this.b = 2;
	}

	Body.prototype.test = function () {};

	function Test () {
		Body.call(this);
	}

	Test.prototype = Object.create(Body.prototype);

	var test = new Test();

	console.log(test);

})();
```

这里几乎没什么改变，关键是Test.prototype = Object.create(Body.prototype)，我们先看一下Object.create的实现

```javascript
(function () {
	Object.create = function (o) {
		function Func () {};
		var Func.prototype = o;
		var func = new Func();
		return func;
	}
})();
```

我们使用Object.create返回了一个中间变量，这样，当我们往Test.prototype上挂东西的时候，影响的只会是这个中间变量，并不会影响到Body。但，并不意味着我Test就不会影响到了。因为原型链的关系，如果你进行了一些骚操作，依旧还是能影响到Body的，Object.create只是帮我们解决了大部分情况而已，并不是绝对的。

### ES6的Class

ES6继承并没什么改变，只不过提供了一些语法糖

```
(function () {
	class Body {
		constructor () {
			this.a = 1;
			this.b = 2;
		}

		test () {
			console.log("I am test");
		}
	}

	class Test extends Body {
		constructor () {
			super();
		}
	}

	var test = new Test();
	console.log(test);
})();
```







