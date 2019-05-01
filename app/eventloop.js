    //---------------              Web Apis / C++
    //|             |
    //|     CALL    |
    //|    STACK    |
    //|             |
    //|             |
    //|             |
    //|             |
    //|             |
    //|             |
    //---------------
    // event loop
    //---------------------------------------------------
    //|                                                 |
    //|                                                 |
    //| Event/Task Queue                                |
    //---------------------------------------------------

const square = function(x){
    return x * x;
}

const cb = function(){

    console.log(square(24));
}

const main = function(){
    console.log('starting main...')
    console.log('execute body');
    setTimeout(cb, 1);
    console.log('Done main');
    console.log('exiting main');
}

main();