const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 735,
    height: 400,
    physics: {
        default: "arcade",
        debug: true
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
    compteur: 0,
    aContainerGrouped: [],
    clickedFirst: "",
    clickedSecond: ""
};

function preload() {
    this.load.image("gauche", "/images/gauche.png");
    this.load.image("droite", "/images/droite.png");
}

function create() {
    this.gameboys = [];
    this.fishes = [];
    this.fishCounter = 0;
    this.gameBoyCounter = 0;
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
    if (container.type === "gameboy") {
        this.gameBoyCounter++;
        if (gameScene.clickedFirst === "") {
            // Si rien n'a été cliqué auparavant, on enregistre le gameboy cliqué
            gameScene.clickedFirst = "gameboy";
            gameScene.firstClickedContainer = container;
        }
    } else if (container.type === "fish") {
        this.fishCounter++;
        if (gameScene.clickedFirst === "gameboy") {
            // Si un gameboy a déjà été cliqué
            gameScene.clickedSecond = "fish";
            gameScene.secondClickedContainer = container;

            // On crée un tween pour déplacer le fish vers le gameboy
            let tween = this.tweens.add({
                targets: container,
                x: gameScene.firstClickedContainer.x,
                y: gameScene.firstClickedContainer.y,
                duration: 1000,
                onUpdate: () => {
                    // Met à jour la position cible du tween pour suivre le gameboy en mouvement
                    tween.updateTo('x', gameScene.firstClickedContainer.x+gameScene.firstClickedContainer.list[0].width, true);
                    tween.updateTo('y', gameScene.firstClickedContainer.y, true);
                },
                onComplete: () => {
                    // On désactive la physique pour le fish
                    container.body.stop();
                    container.body.enable = false;
            
                    // On ajoute le fish au conteneur du gameboy
                    gameScene.firstClickedContainer.add(container);
            
                    // On ajuste la position du fish à l'intérieur du conteneur du gameboy
                    container.x = gameScene.firstClickedContainer.list[0].width;
                    container.y = 0;
            

        // On réinitialise les clics
        gameScene.clickedFirst = "";
        gameScene.clickedSecond = "";
    }
});
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
