function soundInitialize()
{
    musicSplash = new Howl
    (
        {
            urls: ["intro.ogg"],
            loop: true,
            buffer: true,
            volume: 1
        }
    );

    musicGame = new Howl
    (
        {
            urls: ["level1.ogg"],
            loop: true,
            buffer: true,
            volume: 1
        }
    );

    musicWon = new Howl
    (
        {
            urls: ["finished_long.ogg"],
            loop: true,
            buffer: true,
            volume: 1
        }
    );

    musicLost = new Howl
    (
        {
            urls: ["death.ogg"],
            loop: true,
            buffer: true,
            volume: 1
        }
    );

    sfxFire = new Howl
    (
        {
            urls: ["gun9.ogg"],
            buffer: true,
            volume: 1,
            onend:  function()
                    {
                        isSfxPlaying = false; 
                    }
        }
    );

    sfxExplosion = new Howl
    (
        {
            urls: ["explosion3.ogg"],
            buffer: true,
            volume: 1,
            onend: function ()
                   {
                        isSfxPlaying = false;
                   }
        }
    );
}
