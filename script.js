let config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 735,
    height: 400,
    physics: {
        default: "arcade",
        debug: true,
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};
let game = new Phaser.Game(config);

function preload() {
    this.load.image("gauche", "https://i.imgur.com/7VX63Tf.png");
    this.load.image("droite", "https://i.imgur.com/CW6oZe5.png");
}

function create() {
    this.gameboys = [];
    this.fishes = [];
    const acontGameBoys = [];
    const acontFishes = [];
    this.fishCounter = 0;
    this.gameBoyCounter = 0;
    this.aExprFacto = ["(x+2)(x+3)", "(2x+1)(2x-1)", "(x-3)(x+3)", "(4x-1)(4x+1)"];
    this.aExprDev = ["x²+5x+6", "4x²-1", "x²-9", "16x²-1"];
    this.cameras.main.setBackgroundColor('#ffffff');
    
    for (let i = 0; i < this.aExprFacto.length; i++) {
        let gameboy = this.add.image(0, 0, 'gauche').setOrigin(0.5, 0.5);
        let gameboyText = this.add.text(0, 70, this.aExprFacto[i], {
            fontSize: '16px',
            fill: '#f00'
        }).setOrigin(0.5, 0.5);
        let fish = this.add.image(0, 0, 'droite').setOrigin(0.5, 0.5);
        let fishText = this.add.text(0, 70, this.aExprDev[i], {
            fontSize: '16px',
            fill: '#f00'
        }).setOrigin(0.5, 0.5);
        //
        // Create containers for gameboy and fish
        let contGameBoy = this.add.container(200 + i * 50, 300, [gameboy, gameboyText]);
        let contFish = this.add.container(600 + i * 50, 300, [fish, fishText]);
        gameboy.setInteractive();
        fish.setInteractive();
        
        // Enable physics for the containers
        this.physics.world.enable(contGameBoy);
        this.physics.world.enable(contFish);
        // Set velocity and world bounds collision for the containers
        contGameBoy.body
            .setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-150, 150))
            .setCollideWorldBounds(true, 1, 1, true)
            .setBounce(1, 1);
        contFish.body
            .setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-150, 150))
            .setCollideWorldBounds(true, 1, 1, true)
            .setBounce(1, 1);
        // Add pointerdown event listeners to the containers
        contGameBoy.setInteractive(new Phaser.Geom.Rectangle(0, 0, contGameBoy.width, contGameBoy.height), Phaser.Geom.Rectangle.Contains);
        contFish.setInteractive(new Phaser.Geom.Rectangle(0, 0, contFish.width, contFish.height), Phaser.Geom.Rectangle.Contains);
         // Etat
        contGameBoy.etat = "";
        contFish.etat = "";
        
        gameboy.on('pointerdown', () => {
            this.gameBoyCounter++;
            // Parcourir tous les conteneurs et les réinitialiser, sauf celui sur lequel on a cliqué
            acontGameBoys.forEach((cont) => {
                    cont.etat = "";
                    cont.list[0].setTint(0xffffff);
            });
            etatContainer(contGameBoy);
        });
        
        fish.on('pointerdown', () => {
            this.fishCounter++;
            // Parcourir tous les conteneurs et les réinitialiser, sauf celui sur lequel on a cliqué
            acontFishes.forEach((cont) => {
                    cont.etat = "";
                    cont.list[0].setTint(0xffffff);
            });
            etatContainer(contFish); // Appeler 'etatContainer'
        });
        
       
        
        acontGameBoys.push(contGameBoy);
        acontFishes.push(contFish);
    } //end for
    
    // Les collisions 
    let groups = [acontGameBoys, acontFishes];
    for (let i = 0; i < groups.length; i++) {
        for (let j = i; j < groups.length; j++) {
            this.physics.add.collider(groups[i], groups[j]);
        }
    }}

function etatContainer(container) {
    // Le premier enfant du conteneur sera soit gameboy, soit fish
    let sprite = container.list[0];
    if (container.etat === "") {
        container.etat = "cliqué";
        if (sprite.texture.key === 'gauche') {
            sprite.setTint(0x0000ff); // couleur bleue
            
        }
        else if (sprite.texture.key === 'droite') {
            sprite.setTint(0xff0000); // couleur rouge
        }
    } else
    if (container.etat === "cliqué") {
        sprite.setTint(0xffffff)
        // Vous pouvez définir ce que vous voulez faire ici quand l'état est "cliqué"
    }
}



function update() {}