(function () {
    const context = document
        .getElementById("content")
        .getContext("2d");
    const heroImg = new Image();
    const allSpriteImg = new Image();

    let imgPosY = 0;
    let canvasPosX = 0;
    let canvasPosY = 0;

    const maxCanvasW = 400;
    const maxCanvasH = 320;

    const monsterXArr = [];
    const monsterYArr = [];

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

    function draw() {
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
    }

    function drawHero(context, heroImg, imgPosY, canvasPosX, canvasPosY) {
        let hero = {
            img: heroImg,
            context: context,
            imgPos: {
                x: 0,
                y: imgPosY,
                width: 32,
                height: 32
            },

            rect: {
                x: canvasPosX,
                y: canvasPosY,
                width: 40,
                height: 40
            },
            draw: draw
        };

        hero.draw.call(hero);

    }

    function drawMonster(context, allSpriteImg, x, y) {
        let monster = {
            img: allSpriteImg,
            context: context,
            imgPos: {
                x: 858,
                y: 529,
                width: 32,
                height: 32
            },

            rect: {
                x: x,
                y: y,
                width: 40,
                height: 40
            },
            draw: draw
        };
        monster.draw.call(monster);
    }


    let resourceManager = prepare();
    resourceManager.getResource(function (context, heroImg, allSpriteImg) {
        drawHero(context, heroImg, imgPosY, canvasPosX, canvasPosY);
        for (let i = 0; i < 3; i++) {
            monsterXArr.push(parseInt(Math.random() * 10 + 1) * 40);
            monsterYArr.push(parseInt(Math.random() * 8 + 1) * 40);
            drawMonster(context, allSpriteImg, monsterXArr[i], monsterYArr[i]);
        }
    });

    document.onkeydown = function (e) {
        //37 38 39 40
        switch (e.keyCode) {
            case 37:
                if (canvasPosX <= 0) {
                    canvasPosX = 0;
                    console.log("已经是最左边了");
                    return;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterXArr[i] == (canvasPosX - 40) && monsterYArr[i] == canvasPosY) {
                        console.log("you die !");
                        return;
                    }
                }

                canvasPosX -= 40;
                imgPosY = 32;
                break;
            case 38:
                if (canvasPosY <= 0) {
                    canvasPosY = 0;
                    console.log("已经是最顶边了");
                    return;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterYArr[i] == (canvasPosY - 40) && monsterXArr[i] == canvasPosX) {
                        console.log("you die !");
                        return;
                    }
                }
                canvasPosY -= 40;
                imgPosY = 96;
                break;
            case 39:
                if (canvasPosX >= maxCanvasW) {
                    canvasPosX = maxCanvasW;
                    console.log("已经是最右边了");
                    return;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterXArr[i] == (canvasPosX + 40) && monsterYArr[i] == canvasPosY) {
                        console.log("you die !");
                        return;
                    }
                }
                canvasPosX += 40;
                imgPosY = 64;
                break;
            case 40:
                if (canvasPosY >= maxCanvasH) {
                    canvasPosY = maxCanvasH;
                    console.log("已经是最下边了");
                    return;
                }
                for (let i = 0; i < 3; i++) {
                    if (monsterYArr[i] == (canvasPosY + 40) && monsterXArr[i] == canvasPosX) {
                        console.log("you die !");
                        return;
                    }
                }
                canvasPosY += 40;
                imgPosY = 0;
                break;
            default:
                break;
        }
        context.clearRect(0, 0, 1000, 1000);
        drawHero(context, heroImg, imgPosY, canvasPosX, canvasPosY);
        for (let i = 0; i < 3; i++) {
            drawMonster(context, allSpriteImg, monsterXArr[i], monsterYArr[i]);
        }
    }
})();
