(function () {
    const context = document
        .getElementById("content")
        .getContext("2d");
    const heroImg = new Image();
    const allSpriteImg = new Image();

    const maxCanvasW = 400;
    const maxCanvasH = 320;

    const monsterXArr = [];
    const monsterYArr = [];

    let hero;

    function prepare() {
        const imgTask = (img, src) => {
            return new Promise(function (resolve, reject) {
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            })
        };


        const allResourceTask = Promise.all([
            imgTask(heroImg, './hero.png'),
            imgTask(allSpriteImg, './all.jpg'),
        ]);

        return {
            getResource(callback) {
                allResourceTask.then(function () {
                    callback && callback(context, heroImg, allSpriteImg);
                });
            }
        };

    }

    function Base() {
        this.rect = {
            width: 40,
            height: 40
        }
    }

    function Person() {
        Base.call(this);
    }

    Person.prototype = Object.create(Base.prototype);

    Person.prototype.draw = function () {
        this.context
            .drawImage(
                this.img,
                this.imgPos.x,
                this.imgPos.y,
                this.imgPos.width,
                this.imgPos.height,
                this.rect.x,
                this.rect.y,
                this.rect.width,
                this.rect.height
            )
    };

    function Hero() {
        Person.call(this);
        this.img = heroImg;
        this.context = context;
        this.imgPos = {
            x: 0,
            y: 0,
            width: 32,
            height: 32
        };
        this.rect.x = 0;
        this.rect.y = 0;
    }

    Hero.prototype = Object.create(Person.prototype);

    function Monster(canvasPosX = 0, canvasPosY = 0) {
        Person.call(this);
        this.img = allSpriteImg;
        this.context = context;
        this.imgPos = {
            x: 858,
            y: 529,
            width: 32,
            height: 32
        };
        this.rect.x = canvasPosX;
        this.rect.y = canvasPosY;
    }

    Monster.prototype = Object.create(Person.prototype);

    let resourceManager = prepare();
    resourceManager.getResource(function (context, heroImg, allSpriteImg) {
        hero = new Hero();
        hero.draw();
        for (let i = 0; i < 3; i++) {
            monsterXArr.push(parseInt(Math.random() * 10 + 1) * 40);
            monsterYArr.push(parseInt(Math.random() * 8 + 1) * 40);
            new Monster(monsterXArr[i], monsterYArr[i]).draw();
        }
    });

    document.onkeydown = function (e) {
        //37 38 39 40
        switch (e.keyCode) {
            case 37:
                hero.imgPos.y = 32;
                if (hero.rect.x <= 0) {
                    hero.rect.x = 0;
                    console.log("已经是最左边了");
                    break;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterXArr[i] == (hero.rect.x - 40) && monsterYArr[i] == hero.rect.y) {
                        console.log("you die !");
                        return;
                    }
                }
                hero.rect.x -= 40;
                break;
            case 38:
                hero.imgPos.y = 96;
                if (hero.rect.y <= 0) {
                    hero.rect.y = 0;
                    console.log("已经是最顶边了");
                    break;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterYArr[i] == (hero.rect.y - 40) && monsterXArr[i] == hero.rect.x) {
                        console.log("you die !");
                        return;
                    }
                }
                hero.rect.y -= 40;
                break;
            case 39:
                hero.imgPos.y = 64;
                if (hero.rect.x >= maxCanvasW) {
                    hero.rect.x = maxCanvasW;
                    console.log("已经是最右边了");
                    break;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterXArr[i] == (hero.rect.x + 40) && monsterYArr[i] == hero.rect.y) {
                        console.log("you die !");
                        return;
                    }
                }
                hero.rect.x += 40;
                break;
            case 40:
                hero.imgPos.y = 0;
                if (hero.rect.y >= maxCanvasH) {
                    hero.rect.y = maxCanvasH;
                    console.log("已经是最下边了");
                    break;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterYArr[i] == (hero.rect.y + 40) && monsterXArr[i] == hero.rect.x) {
                        console.log("you die !");
                        return;
                    }
                }
                hero.rect.y += 40;
                break;
            default:
                break;
        }
        context.clearRect(0, 0, 1000, 1000);
        hero.draw();
        for (let i = 0; i < 3; i++) {
            new Monster(monsterXArr[i], monsterYArr[i]).draw();
        }
    }
})();
