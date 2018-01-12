THREE.FirstPersonControls = function (object, domElement) {
    // Constants
    var KEY_CODES = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        A: 65,
        D: 68,
        F: 70,
        Q: 81,
        R: 82,
        S: 83,
        W: 87
    };

    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;
    // this.invertVertical = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.freeze = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    if (this.domElement !== document) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.handleResize = function () {
        if (this.domElement === document) {
            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        } else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    };

    this.onMouseMove = function (event) {
        if (this.domElement === document) {
            this.mouseX = event.pageX - this.viewHalfX;
            this.mouseY = event.pageY - this.viewHalfY;
        } else {
            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        }
    };

    this.onKeyDown = function (event) {
        //event.preventDefault();
        var keyCode = event.keyCode;

        if (keyCode === KEY_CODES.Q) {
            this.freeze = !this.freeze;
        } else {
            setDirectionMovement(this, keyCode, true);
        }
    };

    this.onKeyUp = function (event) {
        var keyCode = event.keyCode;
        setDirectionMovement(this, keyCode, false);
    };

    this.update = function (delta) {
        var verticalLookRatio = 1,
            actualMoveSpeed,
            actualLookSpeed,
            targetPosition,
            position;

        if (this.freeze) {
            return;
        }

        if (this.heightSpeed) {
            var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
        } else {
            this.autoSpeedFactor = 0.0;
        }

        actualMoveSpeed = delta * this.movementSpeed;

        if (this.moveForward || (this.autoForward && !this.moveBackward)) {
            this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
        }

        if (this.moveBackward) {
            this.object.translateZ(actualMoveSpeed);
        }

        if (this.moveLeft) {
            this.object.translateX(-actualMoveSpeed);
        }

        if (this.moveRight) {
            this.object.translateX(actualMoveSpeed);
        }

        if (this.moveUp) {
            this.object.translateY(actualMoveSpeed);
        }

        if (this.moveDown) {
            this.object.translateY(-actualMoveSpeed);
        }

        actualLookSpeed = delta * this.lookSpeed;

        if (!this.activeLook) {
            actualLookSpeed = 0;
        }

        if (this.constrainVertical) {
            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
        }

        this.lon += this.mouseX * actualLookSpeed;
        if (this.lookVertical) {
            this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
        }

        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);

        this.theta = THREE.Math.degToRad(this.lon);

        if (this.constrainVertical) {
            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        }

        targetPosition = this.target;
        position = this.object.position;

        targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        targetPosition.y = position.y + 100 * Math.cos(this.phi);
        targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
        
        this.object.lookAt(targetPosition);
    };

    this.domElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, false);

    this.domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);

    window.addEventListener('keydown', bind(this, this.onKeyDown), false);
    window.addEventListener('keyup', bind(this, this.onKeyUp), false);

    function bind(context, fn) {
        return function () {
            fn.apply(context, arguments);
        };
    };

    function setDirectionMovement(context, keyCode, shouldMove) {
        if (keyCode === KEY_CODES.up || keyCode === KEY_CODES.W) {
            context.moveForward = shouldMove;
        } else if (keyCode === KEY_CODES.left || keyCode === KEY_CODES.A) {
            context.moveLeft = shouldMove;
        } else if (keyCode === KEY_CODES.down || keyCode === KEY_CODES.S) {
            context.moveBackward = shouldMove;
        } else if (keyCode === KEY_CODES.right || keyCode === KEY_CODES.D) {
            context.moveRight = shouldMove;
        } else if (keyCode === KEY_CODES.R) {
            context.moveUp = shouldMove;
        } else if (keyCode === KEY_CODES.F) {
            context.moveDown = shouldMove;
        } else {
            return false;
        }
    }

    this.handleResize();
};