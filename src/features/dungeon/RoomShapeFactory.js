export default class RoomShapeFactory {

    static cwRotation () {
        return [
            [0, 1],
            [1, 0]
        ];
    }

    static getSingleRoom() {
        return [
            [1, 0],
            [0, 0],
        ];
    }

    static getLongRoom() {
        return [
            [1, 1],
            [0, 0],
        ];
    }

    static getLRoom() {
        return [
            [1, 1],
            [1, 0],
        ];
    }

    static getSquareRoom() {
        return [
            [1, 1],
            [1, 1],
        ];
    }

    static getAllRooms() {
        return [
            RoomShapeFactory.getSingleRoom(),
            RoomShapeFactory.getLongRoom(),
            RoomShapeFactory.getLRoom(),
            RoomShapeFactory.getSquareRoom(),
        ]
    }

    static getRandomShape() {
        const shapes = RoomShapeFactory.getAllRooms();
        const randomShapeIndex = Math.floor(Math.random() * shapes.length);
        let randomShape = shapes[randomShapeIndex];
        return RoomShapeFactory.rotate( 
            randomShape, 
            Math.floor(Math.random() * 4) 
        ); 
    }

    static rotate(shape, iterations) {
        iterations = iterations % 4;
        while(iterations > 0) {
            for (let i = 0; i < shape.length; i++) {
                for (let j = i; j < shape[i].length; j++) {
                    [shape[i][j], shape[j][i]] = [shape[j][i], shape[i][j]];
                }
            }
            for (let i = 0; i < shape.length; i++) {
                shape[i].reverse();
            }
            iterations--;
        }
        return shape;
    }
}
