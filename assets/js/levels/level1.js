const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ],
    [
        new Cloud(),
    ],
    [
        new BackgroundObject('assets/img/5_background/layers/air.png', 1),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', -0.5),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', -0.25),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),
    ],
);