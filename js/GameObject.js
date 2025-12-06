class GameObject {
    constructor(_id = null) {
        this.x = c.width / 2;
        this.y = c.height / 2;

        this.angle = 0;

        this.w = 100;
        this.h = 100;

        this.vx = 0;
        this.vy = 0;

        this.color = `hotpink`;

        this.canJump = false;

        this.world = { x: 0, y: 0 };

        // Image handling
        this.img = null;

        if (_id) {
            this.setImage(_id);
        }
    }

    setImage(_id) {
        const el = document.querySelector(_id);
        if (el) {
            this.img = el;
            this.w = el.width || this.w;
            this.h = el.height || this.h;
        }
    }

    render() {
        ctx.save();
        ctx.translate(this.x + this.world.x, this.y + this.world.y);
        ctx.rotate(this.angle * Math.PI / 180);

        if (this.img) {
            // Draw the image
            ctx.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
        } else {
            // Fallback to colored rectangle
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        }

        ctx.restore();
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    top() { return { x: this.x, y: this.y - this.h / 2 }; }
    bottom() { return { x: this.x, y: this.y + this.h / 2 }; }
    left() { return { x: this.x - this.w / 2, y: this.y }; }
    right() { return { x: this.x + this.w / 2, y: this.y }; }

    overlaps(_obj) {
        return (
            this.top().y + this.world.y < _obj.bottom().y + _obj.world.y &&
            this.bottom().y + this.world.y > _obj.top().y + _obj.world.y &&
            this.left().x + this.world.x < _obj.right().x + _obj.world.x &&
            this.right().x + this.world.x > _obj.left().x + _obj.world.x
        );
    }

    isOverPoint(_p) {
        return (
            this.top().y + this.world.y < _p.y &&
            this.bottom().y + this.world.y > _p.y &&
            this.left().x + this.world.x < _p.x &&
            this.right().x + this.world.x > _p.x
        );
    }
}
