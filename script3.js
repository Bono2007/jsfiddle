const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 735,
    height: 400,
    physics: {
        default: "arcade",
        debug: false
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let gameScene = {
    acontGameBoys: [],
    acontFishes: [],
    clickedFirst: "",
    clickedSecond: ""
};

function preload() {
    this.load.image("gauche", "/images/gauche.png");
    this.load.image("droite", "/images/droite.png");
}

function create() {
    this.aExprFacto = ["(x+2)(x+3)", "(2x+1)(2x-1)", "(x-3)(x+3)", "(4x-1)(4x+1)"];
    this.aExprDev = ["x²+5x+6", "4x²-1", "x²-9", "16x²-1"];
    this.cameras.main.setBackgroundColor("#ffffff");

    for (let i = 0; i < this.aExprFacto.length; i++) {
        createGameObject.call(this, "gauche", this.aExprFacto[i], 200 + i * 50, gameScene.acontGameBoys, "gameboy");
        createGameObject.call(this, "droite", this.aExprDev[i], 600 + i * 50, gameScene.acontFishes, "fish");
    }

    let groups = [gameScene.acontGameBoys, gameScene.acontFishes];
    for (let i = 0; i < groups.length; i++) {
        for (let j = i; j < groups.length; j++) {
            this.physics.add.collider(groups[i], groups[j]);
        }
    }
}

function createGameObject(imageKey, text, position, containerArray, type) {
    let image = this.add.image(0, 0, imageKey).setOrigin(0.5, 0.5);
    let imageText = this.add.text(0, 70, text, { fontSize: "16px", fill: "#f00" }).setOrigin(0.5, 0.5);
    let container = this.add.container(position, 300, [image, imageText]);
    image.setInteractive();
    this.physics.world.enable(container);
    container.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-150, 150))
        .setCollideWorldBounds(true, 1, 1, true)
        .setBounce(1, 1)
        .maxVelocity.set(150, 150);
    container.setInteractive(new Phaser.Geom.Rectangle(0, 0, container.width, container.height), Phaser.Geom.Rectangle.Contains);
    container.etat = "";
    container.groupe = false;
    container.type = type;
    containerArray.push(container);
    image.on("pointerdown", () => {
        handlePointerDown.call(this, container);
    });
}

function handlePointerDown(container) {
    // Si le conteneur cliqué contient déjà un autre conteneur
    if (container.list.length > 2) {
        console.log("1:")
        // On récupère le conteneur enfant
        let childContainer = container.list[2];
        // On retire le conteneur enfant du conteneur parent
        container.remove(childContainer);
        console.log("2:")
        // On ajoute le conteneur enfant à la scène
        this.add.existing(childContainer);
        console.log("3:")
        childContainer.x=container.x;
        childContainer.y=container.y;
        console.log("4:")
        this.tweens.add({
            targets: childContainer,
            x:735/2,
            y:400/2,
            duration: 1000
        })
        console.log("5:")
        // On réactive la physique pour le conteneur enfant
        this.physics.world.enable(childContainer);
        console.log("6:")
        childContainer.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-150, 150));
        // On réinitialise firstClickedContainer et clickedFirst
        //gameScene.firstClickedContainer = null;
        gameScene.clickedFirst = "";
        //gameScene.secondClickedContainer = null;
        gameScene.clickedSecond = "";
        console.log("7:")
    } else
    if (container.type === "gameboy") {
        console.log("11:")
        if (gameScene.clickedFirst === "fish") {
            console.log("12:")
            // Si un fish a déjà été cliqué
            gameScene.clickedSecond = "gameboy";
            gameScene.secondClickedContainer = container;
            // On enregistre la position actuelle du fish
            let targetX = gameScene.firstClickedContainer.x-gameScene.firstClickedContainer.list[0].width;
            let targetY = gameScene.firstClickedContainer.y;
            console.log("13:")
            // On crée un tween pour déplacer le fish vers le gameboy
            let tween=this.tweens.add({
                targets: container,
                x: targetX,
                y: targetY,
                duration: 1000,
                onUpdate: () => {
                    // Met à jour la position cible du tween pour suivre le gameboy en mouvement
                    tween.updateTo('x', gameScene.firstClickedContainer.x-gameScene.firstClickedContainer.list[0].width, true);
                    tween.updateTo('y', gameScene.firstClickedContainer.y, true);
                },
                onComplete: () => {
                    // On désactive la physique pour le gameboy
                    container.body.stop();
                    container.body.enable = false;
                    console.log("14:")
                    // On ajoute le gameboy au conteneur du fish
                    gameScene.firstClickedContainer.add(container);
                    console.log("15:")
                    // On ajuste la position du gameboy à l'intérieur du conteneur du fish
                    container.x = -gameScene.firstClickedContainer.list[0].width;
                    container.y = 0;
                    console.log("16:")
                    // On réinitialise les clics
                    gameScene.clickedFirst = "";
                    gameScene.clickedSecond = "";
                    console.log("17:")
                }
            });
        } else if (gameScene.clickedFirst === "") {
            console.log("21:")
            // Si rien n'a été cliqué auparavant, on enregistre le gameboy cliqué
            gameScene.clickedFirst = "gameboy";
            gameScene.firstClickedContainer = container;
        }
    } else if (container.type === "fish") {
        console.log("31:")
        if (gameScene.clickedFirst === "gameboy") {
            // Si un gameboy a déjà été cliqué
            gameScene.clickedSecond = "fish";
            gameScene.secondClickedContainer = container;
            console.log("32:")
            // On enregistre la position actuelle du gameboy
            let targetX = gameScene.firstClickedContainer.x;
            let targetY = gameScene.firstClickedContainer.y;
            console.log("33:")
            // On crée un tween pour déplacer le gameboy vers le fish
            let tween=this.tweens.add({
                targets: container,
                x: targetX,
                y: targetY,
                duration: 1000,
                onUpdate: () => {
                    // Met à jour la position cible du tween pour suivre le gameboy en mouvement
                    tween.updateTo('x', gameScene.firstClickedContainer.x+gameScene.firstClickedContainer.list[0].width, true);
                    tween.updateTo('y', gameScene.firstClickedContainer.y, true);
                    console.log("34:")
                },
                onComplete: () => {
                    // On désactive la physique pour le fish
                    container.body.stop();
                    container.body.enable = false;
                    console.log("35:")
                    // On ajoute le fish au conteneur du gameboy
                    gameScene.firstClickedContainer.add(container);
                    console.log("36:")
                    // On ajuste la position du fish à l'intérieur du conteneur du gameboy
                    container.x = gameScene.firstClickedContainer.list[0].width;
                    container.y = 0;
                    console.log("37:"+gameScene.firstClickedContainer.list[0].width)
                    // On réinitialise les clics
                    gameScene.clickedFirst = "";
                    gameScene.clickedSecond = "";
                }
            });
        } else if (gameScene.clickedFirst === "") {
            console.log("41:")
            // Si rien n'a été cliqué auparavant, on enregistre le fish cliqué
            gameScene.clickedFirst = "fish";
            gameScene.firstClickedContainer = container;
        }
    }

    // On réinitialise tous les conteneurs
    gameScene.acontGameBoys.forEach((cont) => {
        cont.etat = "";
        cont.list[0].setTint(0xffffff);
    });
    gameScene.acontFishes.forEach((cont) => {
        cont.etat = "";
        cont.list[0].setTint(0xffffff);
    });

}
function update() {
    // Update logic here
}
