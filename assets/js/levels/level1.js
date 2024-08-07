const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ElGallonatorBoss(),
    ],
    [
        new Cloud(),
    ],
    [
        new BackgroundObject('assets/img/5_background/layers/air.png', 1, 0, 1),

        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0, -2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 0, -1),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0, 0),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 0, 1),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0, 2), 
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 0, 3),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0, 4), 

        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 0.2, -2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0.2, -1),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 0.2, 0),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0.2, 1),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 0.2, 2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0.2, 3),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 0.2, 4),

        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0, -2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 0, -1),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0, 0),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 0, 1),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0, 2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 0, 3),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0, 4),
    ],
    3000,
);