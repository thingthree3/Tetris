class InputHandler{
    #debug = false;
    #gameIsPaused = false;
    #vaildKeys = {'KeyS':'down', 'KeyD':'right', 'KeyA':'left', 'ArrowDown':'down', 'ArrowRight':'right', 'ArrowLeft':'left', 'Space':'rotate'};
    #keys = [];

    //constructor only adds event listeners.
    constructor(){

        window.addEventListener('keydown', ({ code }) => {
            if (this.#vaildKeys.hasOwnProperty(code)){
                const key = this.#vaildKeys[code];

                if(this.#keys.includes(key)){ return; }

                // if players pressing both left and right key at same time update moving direction to the new key pressed. 
                if(key === "right" && this.#keys.includes("left")){ this.#keys.splice( this.#keys.indexOf("left"), 1 ); }//remove left key
                else if(key === 'left' && this.#keys.includes("right")){ this.#keys.splice( this.#keys.indexOf("right"), 1); }
                
                // if players pressing both up and down key at same time update moving direction to the new key pressed. 
                if(key === "up" && this.#keys.includes("down")){ this.#keys.splice( this.#keys.indexOf("down"), 1 ); }
                else if(key === 'down' && this.#keys.includes("up")){ this.#keys.splice( this.#keys.indexOf("up"), 1 ); }

                this.#keys.push(key);
            }
            else {
                switch (code) {
                    case "KeyR":
                        window.location.reload();
                        return;
                    case "KeyF":
                        this.SwitchIsOnDebug();
                        return;
                    case "KeyP":
                        this.SwitchtGameIsPaused();
                        return;
                    default:
                        return;
                }
            }
        });
        
        window.addEventListener('keyup', ({ code }) => {
            if (!this.#vaildKeys.hasOwnProperty(code)){ return; }
            const key = this.#vaildKeys[code];
            if(!this.#keys.includes(key)){ return; }

            this.#keys.splice( this.#keys.indexOf(key), 1 );
        });
    }

    getGameIsPaused(){ return this.#gameIsPaused; }

    getIsOnDebug(){ return this.#debug; }
    
    getKeys(){ return this.#keys; }


    SwitchtGameIsPaused(){ this.#gameIsPaused = !this.#gameIsPaused; }

    SwitchIsOnDebug(){ this.#debug = !this.#debug; }
}