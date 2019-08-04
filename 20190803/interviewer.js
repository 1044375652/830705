// 1.this

// 1.1
function show() {
	// body...
	console.log("this:",this);//这个this是obj，因为是通过obj打点调用的
}

var obj = {
	show : show
};

obj.show();

function show() {
	// body...
	console.log("this:",this);
}

var obj = {
	show : function () {
		// body...
		show();//这里并没有通过谁打点调用，所以是window
	}
};

obj.show();

// 1.2
var obj = {
	show : function () {
		// body...
		console.log("this:",this);
	}
};

(0,obj.show)();
// 这个打印出来的是window，首先(0,obj.show)叫做逗号运算符，
// 不管前面有几项，只会运行最后一项，就是obj.show，
// 而obj.show返回的就是一个函数的引用，然后我们调用他（并没有通过谁打点调用，所以返回的是this）

// 1.3
var obj = {
	sub : {
		show : function () {
			// body...
			console.log('this:',this);
		}
	}
};

obj.sub.show();//这里打印的是sub对象，不管前面有几个打点，以最后一个为准

// 1.4
var obj = {
	show : function () {
		// body...
		// this.a = 123;
		console.log("this:",this);
	}
};

var newObj = new obj.show();
// 首先，这里有一个优先级的顺序，先通过打点调用，
// 返回了一个函数的引用，然后再new
// 所以，最后就是new了一个匿名函数

// 1.5
var obj = {
	show : function () {
		// body...
		// this.a = 123;
		console.log("this:",this);
	}
}

var newObj = new (obj.show.bind(obj))();
// 与1.4同理

// 1.7
var obj = {
	show: function () {
		console.log('this:', this);
	}
};
var elem = document.getElementById('book-search-results');
	elem.addEventListener('click', obj.show);
	elem.addEventListener('click', obj.show.bind(obj));
	elem.addEventListener('click', function () {
		obj.show();
});
// 打印出来的结果分别是
// this: 绑定点击事件的元素
// this: {show: ƒ}
// this: {show: ƒ}
// 首先，还是，谁打点调用this就是谁，在绑定点击事件的时候，就已经
// 绑定好了this，而后面的obj.show，只是返回一个函数的引用而已
// 第二个，用了bind，强制绑定了obj对象
// 第三个，没什么特别的

// 2 作用域

// 2.1
var person = 1;

function showPerson() {
	// body...
	var person = 2;
	console.log(person);
}

showPerson();//person:2;先找自己的，找不到往父级找

// 2.2
var person = 1;
function showPerson() {
	console.log(person);
	var person = 2;
}
showPerson();//person:undefined，变量提升

// 2.3
var person = 1;
function showPerson() {
	// body...
	console.log(person);
	var person = 2;
	function person() {
		// body...
	}
}

showPerson();
//还是变量提升的问题，但是函数的变量提升比变量的还要厉害，导致打出来的是func person

// 2.5
for (var i = 0; i < 10; i++) {
	console.log(i);
}
//这个for没啥特殊的，都把i从0~9全部输出了

for(var i = 0;i < 10;i++){
	setTimeout(function () {
		// body...
		console.log(i);
	},0);
}
// 最终输出的都是10
// 首先是因为作用域的问题，在ES5,只有全局作用域和函数作用域
// 导致了i在一个循环之后，累加到了10
// 其次，是因为js是单进程的，他有一个任务队列，这个任务队列，
// 只有当当前的任务执行完成之后，才会去执行任务队列的任务
// 而setTimeOut函数就是把任务压入任务队列中，当for循环了10此，才把
// 任务拿出来执行，此时，i已经累加到了10

for(var i = 0;i < 10;i++){
	(function (i) {
		// body...
		setTimeout(function () {
			// body...
			console.log(i);
		},0)
	})(i)
}
// 这个for是相对与上面的改进，利用闭包，把作用域隔离了起来

for(let i = 0;i < 10;i++){
	console.log(i);
}
// 这个是利用ES6新的函数作用域

// 3 面对对象
// 3.1
function Person() {
	// body...
	this.name = 1;
	return {};
}

var person = new Person();
console.log("name:",person.name);
// 打印出来的是undefined，因为我们强制return了一个空对象
// 不然返回的是Person的一个实例

// 3.2
function Person() {
	// body...
	this.name = 1;
}
Person.prototype = {
	show : function () {
		// body...
		console.log("name is : ",this.name);
	}
};
var person = new Person();
person.show();
// 通过prototype给实例添加一个show方法
// 通过谁打点调用,this就是指向谁

// 3.3
function Person() {
	// body...
	this.name = 1;
}
Person.prototype = {
	name : 2,
	show : function () {
		// body...
		console.log(this);
	}
};
var person = new Person();

Person.prototype.show = function () {
	// body...
	console.log("new show");
}
person.show();


// 3.4
function Person() {
	// body...
	this.name = 1;
}
Person.prototype = {
	name : 2,
	show : function () {
		// body...
		console.log("name is : ",this.name);
	}
};

var person = new Person();
var person2 = new Person();

person.show = function (argument) {
	// body...
	console.log("new show");
}

person2.show();
person.show();

// 3.5
function Person() {
	this.name = 1;
}
Person.prototype = {
	name: 2,
	show: function () {
		console.log('name is:', this.name);
	}
};
// Person.prototype.show();
// (new Person()).show();
console.log(new Person());
