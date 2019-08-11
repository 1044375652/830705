### 经过今天的学习，手写一个Promise

```javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {
        this._status = "pending";
        processor(
            () => {
                this.resolve();
            },
            () => {

            }
        );
    }

    Promise.prototype = {
        then : function(){

        },
        resolve : function(){

        }
    }

    global.Promise = Promise;
})(window)
</script>
```

我们在上述代码中，先把Promise的框架结构定义出来了，并且把全局的Promise替换成自己的Promise，并没有干啥，也不能干啥

```javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {
        this._status = "pending";
        processor(
            () => {
                this.resolve();
            },
            () => {

            }
        );
    }

    Promise.prototype = {
        then : function(){

        },
        resolve : function(){

        }
    }

    global.Promise = Promise;
})(window)
</script>
//这里附上测试代码
<script type="text/javascript">
	(new Promise((resolve,reject) => {
		setTimeout(function(){
			resolve(123);			
		},1000);
	}))
	.then(function(res){
		console.log(res);
	})
</script>
```

接下来开始完善

````javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {//因为我们传给Promise的就是一个函数
        this._status = "pending";//定义了Promise的状态（pending,fullfilled,rejected）
        processor(
            res => {//我们会给resolve函数传参的
                this.resolve(res);//调用定义的resolve
            },
            () => {

            }
        );
    }

    Promise.prototype = {
        then : function(onFullfilled){
        	this.onFullfilled = onFullfilled;//把传给then的函数记录下来，方便给resolve调用
        },
        resolve : function(res){
			this._status = "fullfilled";//改变Promise的状态
			this.currentRes = res;//拿到传进来的参数，并且记录下来
			this.onFullfilled(this.currentRes);//调用then中定义的方法
        }
    }

    global.Promise = Promise;
})(window)
</script>
<script type="text/javascript">
	(new Promise((resolve,reject) => {
		setTimeout(function(){
			resolve(123);			
		},1000);
	}))
	.then(function(res){
		console.log(res);
	})
</script>
````

以上代码BUG，就是new Promise里面的函数是同步的，只不过我们使用了setTimeout把他变成异步的。这就导致了我们在调用resolve函数的时候，then并没有把他的参数挂上，导致在resolve中无法使用then中的方法（因为没有挂上），所以我们来个特判

```javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {
        this._status = "pending";
        processor(
            res => {
                this.resolve(res);
            },
            () => {

            }
        );
    }

    Promise.prototype = {
        then : function(onFullfilled){
        	this.onFullfilled = onFullfilled;
        	if(this._status === "fullfilled"){//如果then没挂上，就来这里执行
				onFullfilled(this.currentRes);
        	}
        },
        resolve : function(res){
			this._status = "fullfilled";
			this.currentRes = res;
			if(this.onFullfilled){//如果then把函数挂上了，才可以执行
				this.onFullfilled(this.currentRes);				
			}
        }
    }

    global.Promise = Promise;
})(window)
</script>
<script type="text/javascript">
	(new Promise((resolve,reject) => {
		setTimeout(function(){
			resolve(123);			
		},1000);
	}))
	.then(function(res){
		console.log(res);
	})
</script>
```

上述代码就简单完成了一下Promise，但是，问题又来了，我们通常使用Promsie都会是链式调用，但是上述代码无法做到，我们继续完善

```javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {
        this._status = "pending";
        processor(
            res => {
                this.resolve(res);
            },
            () => {

            }
        );
    }

    Promise.prototype = {
        then : function(onFullfilled){
        	this.onFullfilled = onFullfilled;
        	this.next = new Promise((resolve,reject) => {

        	});
        	if(this._status === "fullfilled"){
				onFullfilled(this.currentRes);
        	}
        	return this.next;//其实想要链式调用，返回要给Promise实例即可
        },
        resolve : function(res){
			this._status = "fullfilled";
			this.currentRes = res;
			if(this.onFullfilled){
				this.onFullfilled(this.currentRes);				
			}
        }
    }

    global.Promise = Promise;
})(window)
</script>
<script type="text/javascript">
	(new Promise((resolve,reject) => {
		setTimeout(function(){
			resolve(123);			
		},1000);
	}))
	.then(function(res){
		console.log(res);
		return 1;
	})
	.then(function(res){
		console.log(res);
	})
</script>
```

虽然上述代码看着好像没问题，但是运行一下，会发现打印不出来。这是因为你没有决议，即你新建了一个Promise，你没有调用他的resolve方法，没有改变他的_status，导致无法往下走，我们继续改善

```javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {
        this._status = "pending";
        processor(
            res => {
                this.resolve(res);
            },
            () => {

            }
        );
    }

    Promise.prototype = {
    	_taskCB : function(){
    		var res = this.onFullfilled(this.currentRes);
    		this.next.resolve(res);
    	},
        then : function(onFullfilled){
        	this.onFullfilled = onFullfilled;
        	this.next = new Promise((resolve,reject) => {

        	});
        	if(this._status === "fullfilled"){
				this._taskCB();
        	}
        	return this.next;
        },
        resolve : function(res){
			this._status = "fullfilled";
			this.currentRes = res;
			if(this.onFullfilled){
				this._taskCB();
			}	
        }
    }

    global.Promise = Promise;
})(window)
</script>
<script type="text/javascript">
	(new Promise((resolve,reject) => {
		setTimeout(function(){
			resolve(123);			
		},1000);
	}))
	.then(function(res){
		console.log(res);
		return 1;
	})
	.then(function(res){
		console.log(res);
	})
</script>
```

其实，我们在调用then中的方法的时候，就该也使用resolve来改变一下状态。我们抽出一个函数，把then中的函数执行，并且决议一下（即调用resolve方法）。

但问题又来了，如果返回的是一个Promise对象呢？上述代码又有问题了，我们继续改善

```javascript
<script type="text/javascript">
    (function(global){
    function Promise (processor) {
        this._status = "pending";
        processor(
            res => {
                this.resolve(res);
            },
            () => {

            }
        );
    }

    Promise.prototype = {
    	_taskCB : function(){
    		var res = this.onFullfilled(this.currentRes);
    		if(res instanceof Promise){
    			this.currentRes = res.currentRes;
    		}else{
    			this.currentRes = res;
    		}
    		this.next.resolve(this.currentRes);
    	},
        then : function(onFullfilled){
        	this.onFullfilled = onFullfilled;
        	this.next = new Promise((resolve,reject) => {

        	});
        	if(this._status === "fullfilled"){
				this._taskCB();
        	}
        	return this.next;
        },
        resolve : function(res){
			this._status = "fullfilled";
			this.currentRes = res;
			if(this.onFullfilled){
				this._taskCB();
			}	
        }
    }

    global.Promise = Promise;
})(window)
</script>
<script type="text/javascript">
	(new Promise((resolve,reject) => {
		setTimeout(function(){
			resolve(123);			
		},1000);
	}))
	.then(function(res){
		console.log(res);
		return new Promise((resolve,reject) => {
			resolve("asd");
		});
	})
	.then(function(res){
		console.log(res);
	})
</script>
```

其实也很简单，我们做一个特判，当遇到是Promise对象的时候，我们拿到他的返回值，然后赋给我们的currentRes即可。