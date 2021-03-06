/**
 * Created by Arabella Brayer on 8/11/2016.
 */

function Grid(nbCols, nbRows, T, R, P, S, mode, imitMode) {
    "use strict";

    this.setDim(nbCols, nbRows);
    this.initMatrix(nbCols, nbRows); // init this.cellMatrix
    this.t = T;
    this.r = R;
    this.p = P;
    this.s = S;
    this.mode = mode;
    this.imitationMode = imitMode; // unconditionnal imitation, or other kind of
    this.selectedNeighbor = this.generateMatrix(nbCols, nbRows);
}

Grid.prototype.initMatrix = function (nbCols, nbRows) {
    "use strict";

    this.cellMatrix = this.generateMatrix(nbCols, nbRows);

    this.cleanCount();
    for (var i=0; i < nbCols; i++) {
        for(var j=0; j < nbRows; j++) {
            var state = Math.round(Math.random()+1);
            if(state === COOPSTATE){
                this.nbCoops++;
            } else {
                this.nbDefect++;
            }
            this.cellMatrix[i][j].setAction(state);
        }
    }
};

Grid.prototype.getRate = function () {
    return this.nbCoops / (this.nbRows * this.nbCols);
};


Grid.prototype.generateMatrix = function (nbCols, nbRows) {
    "use strict";
    var arr = [];
    for (var i=0; i < nbCols; i++) {
        arr[i] = [];
        for(var j=0; j < nbRows; j++) {
            arr[i][j] = new Cell();
        }
    }
    return arr;
};

Grid.prototype.changePayoff = function(selectedVar){
    switch (selectedVar){
        case TMINUS:
            this.t--;
            break;
        case TPLUS:
            this.t++;
            break;
        case RMINUS:
            this.r--;
            break;
        case RPLUS:
            this.r++;
            break;
        case PMINUS:
            this.p--;
            break;
        case PPLUS:
            this.p++;
            break;
        case SMINUS:
            this.s--;
            break;
        case SPLUS:
            this.s++;
            break;
    }
    this.initMatrix(this.nbCols, this.nbRows);
};

Grid.prototype.xchangeMode = function () {
    if(this.mode === MOORE){
        this.mode = VN;
    } else {
        this.mode = MOORE;
    }
    this.initMatrix(this.nbCols, this.nbRows);

};

Grid.prototype.xchangeImitMode = function () {
    "use strict";

    if(this.imitationMode === UNCOND){
        this.imitationMode = FUNC;
    } else {
        this.imitationMode = UNCOND;
    }
    this.initMatrix(this.nbCols, this.nbRows);

};

Grid.prototype.cleanCount = function () {
    this.nbCoops = 0;
    this.nbDefect = 0;
};

Grid.prototype.doDefect = function (x, y) {
    "use strict";

    console.assert(Number.isInteger(x), x);
    console.assert(Number.isInteger(y), y);

    this.nbDefect++;
    this.cellMatrix[x][y].setAction(DEFECTSTATE);
};


Grid.prototype.doCooperate = function (x, y) {
    "use strict";

    console.assert(Number.isInteger(x), x);
    console.assert(Number.isInteger(y), y);

    this.nbCoops++;
    this.cellMatrix[x][y].setAction(COOPSTATE);
};


Grid.prototype.getNbCols = function () {
    "use strict";

    return this.nbCols;
};


Grid.prototype.getNbRows = function () {
    "use strict";

    return this.nbRows;
};


Grid.prototype.cooperate = function (x, y) {
    "use strict";

    console.assert(Number.isInteger(x), x);
    console.assert(Number.isInteger(y), y);

    return (this.cellMatrix[x][y].action == COOPSTATE);
};

/**
 * Compute the scores for all cell in the matrix.
 */
Grid.prototype.computeScores = function () {
    "use strict";

    var x;
    var y;
    for(x=0; x < this.nbCols; x++){
        for(y=0; y < this.nbRows; y++){
            this.computeScore(x, y);
        }
    }
};

Grid.prototype.isMooreMode = function () {
    return this.mode == MOORE;
};

Grid.prototype.computeScore = function (x, y) {
    "use strict";

    if(this.isMooreMode()){
        this.computeScoreMoore(x, y);
    } else {
        this.computeScoreVonNeumann(x, y);
    }
};

Number.prototype.mod = function(n) {
    var m = (( this % n) + n) % n;
    return m < 0 ? m + Math.abs(n) : m;
};

Grid.prototype.computeScoreMoore = function (x, y) {
    "use strict";

    // uncond. imit mode. add an if statement
        for(var countx = -1; countx <= 1; countx++){
            for(var county = -1; county <= 1; county++){
                if (!(countx === 0 && county === 0)){
                    this.cellMatrix[x][y].addScore(this.getScoreUncond(this.cellMatrix[x][y].action, this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)].action));
                }
            }
        }
    if(this.imitationMode == FUNC) {
        // select randomly ONE of the neighbors

        var adv = [];
        for(countx = -1; countx <= 1; countx++){
            for(county = -1; county <= 1; county++){
                if (!(countx === 0 && county === 0)){
                    adv.push([(x + countx).mod(this.nbCols), (y + county).mod(this.nbRows)]); // push the opponant
                }
            }
        }
        this.selectedNeighbor[x][y] = adv[Math.floor(Math.random() * adv.length)];
    }
};

Grid.prototype.getMaxPayoff = function () {
    "use strict";

    var arr = [this.p, this.t, this.r, this.s];
    return Math.max.apply(Math, arr);
};

Grid.prototype.getMinPayoff = function () {
    "use strict";

    var arr = [this.p, this.t, this.r, this.s];
    return Math.min.apply(Math, arr);
};

Grid.prototype.getScoreUncond = function (action1, action2) {
    "use strict";

    if(action1 === COOPSTATE){
        if(action2 === COOPSTATE){
            return this.r;
        } else { // player 2 defects
            return this.s;
        }
    } else { // player 1 defects
        if(action2 === COOPSTATE){
            return this.t;
        } else {
            return this.p;
        }
    }
};

Grid.prototype.computeScoreVonNeumann = function (x, y) {
    "use strict";


    this.cellMatrix[x][y].addScore(this.getScoreUncond(this.cellMatrix[x][y].action, this.cellMatrix[(x - 1).mod(this.nbCols)][y].action));
    this.cellMatrix[x][y].addScore(this.getScoreUncond(this.cellMatrix[x][y].action, this.cellMatrix[x][(y - 1).mod(this.nbRows)].action));
    this.cellMatrix[x][y].addScore(this.getScoreUncond(this.cellMatrix[x][y].action, this.cellMatrix[x][(y + 1).mod(this.nbRows)].action));
    this.cellMatrix[x][y].addScore(this.getScoreUncond(this.cellMatrix[x][y].action, this.cellMatrix[(x + 1).mod(this.nbCols)][y].action));
    if(this.imitationMode == FUNC){
        // select randomly ONE of the neighbors

        var adv = [];
        adv.push([(x - 1).mod(this.nbCols), y]); // push the opponant
        adv.push([x, (y - 1).mod(this.nbRows)]);
        adv.push([x, (y + 1).mod(this.nbRows)]);
        adv.push([(x + 1).mod(this.nbCols), y]);

        this.selectedNeighbor[x][y] = adv[Math.floor(Math.random() * adv.length)];
    }

};


Grid.prototype.computeNewGrid = function () {
    "use strict";

    var temp;
    var newMatrix = this.generateMatrix(this.nbCols, this.nbRows);
    this.cleanCount();

    if(this.imitationMode === UNCOND){
        for(var x=0; x < this.nbCols; x++){
            for(var y=0; y < this.nbRows; y++){
                temp = this.getBestNeighborAction(x, y);
                if(temp === COOPSTATE){
                    this.nbCoops++;
                } else {
                    this.nbDefect++;
                }
                newMatrix[x][y].action = temp;
            }
        }
    } else { // function mode
        for(x=0; x < this.nbCols; x++){
            for(y=0; y < this.nbRows; y++){
                // adapt its action with a probability of Pij like below :
                // P ij = ( 1 + [W j -W i ]/[N*(max{P,R,T,S}-min{P,R,T,S})] ) / 2
                var Wi = this.cellMatrix[x][y].score;
                var Wj = this.cellMatrix[this.selectedNeighbor[x][y][0]][this.selectedNeighbor[x][y][1]].score;
                // Wj and Wi are respectively the scores obtained with the opponant
                var Pij = (1 + (Wj-Wi)/(this.imitationMode*(this.getMaxPayoff()-this.getMinPayoff())))/2;
                if(Math.random() <= Pij){
                    // la probabilité est comprise dans l'intervalle, l'action est "copiée"
                    temp = this.cellMatrix[this.selectedNeighbor[x][y][0]][this.selectedNeighbor[x][y][1]].action;
                } else {// sinon, la même qu'avant
                    temp = this.cellMatrix[y][x].action;
                }
                // TODO add a new color in the case of changing and so on (like in first paper)
                if(temp === COOPSTATE){
                    this.nbCoops++;
                } else {
                    this.nbDefect++;
                }
                newMatrix[x][y].action = temp;
            }
        }
    }
    this.cellMatrix = newMatrix;
};


Grid.prototype.getBestNeighborAction = function (x, y) {
    "use strict";

    console.assert(Number.isInteger(x), x);
    console.assert(Number.isInteger(y), y);

    var maxi = -80000; // infini
    var action = NOACTION;
    var array_result = [];
    if(this.isMooreMode()){
        for(var countx = -1; countx <= 1; countx++){
            for(var county = -1; county <= 1; county++){
                if(this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)].score > maxi){
                    maxi = this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)].score;
                    action = this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)].action;
                    array_result = []; // clear
                    array_result.push(action);
                } else if (this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)].score == maxi){
                    array_result.push(this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)].action);
                }
            }
        }
    } else { // vn mode
        // choisir au hasard parmi les meilleurs, sinon model non random... faux.

        var toTest = [];
        toTest.push([this.cellMatrix[x][y].score, this.cellMatrix[x][y].action]);
        toTest.push([this.cellMatrix[(x - 1).mod(this.nbCols)][y].score, this.cellMatrix[(x - 1).mod(this.nbCols)][y].action]);
        toTest.push([this.cellMatrix[x][(y - 1).mod(this.nbRows)].score, this.cellMatrix[x][(y - 1).mod(this.nbRows)].action]);
        toTest.push([this.cellMatrix[x][(y + 1).mod(this.nbRows)].score, this.cellMatrix[x][(y + 1).mod(this.nbRows)].action]);
        toTest.push([this.cellMatrix[(x + 1).mod(this.nbCols)][y].score, this.cellMatrix[(x + 1).mod(this.nbCols)][y].action]);

        for(var i=0 ; i < toTest.length; i++){
            // console.log("elem " + toTest[i]);
            if(toTest[i][0] > maxi) {
                array_result = [];
                array_result.push(toTest[i][1]); // push the action
                maxi = toTest[i][0];
            } else if (toTest[i][0] === maxi){
                array_result.push(toTest[i][1]);
            }
        }
    }
    // console.log("getBestNeighborAction x y" + x +":" + y + ":::" + action);

    // console.log(("array result lengh :" + array_result.length));
    action = array_result[Math.floor(Math.random()*array_result.length)];
    // console.log(("action choice :" + action));
    return action;
};

Grid.prototype.printMatrix = function () {
    "use strict";

    var x;
    var y;
    var line;

    for (y = 0; y < this.getNbRows(); ++y) {
        line = (y < 10 ? " " : "") + y + "|";
        for (x = 0; x < this.getNbCols(); ++x) {
            line += (this.cooperate(x, y) ? "c" : "d");
        }
        console.log(line);
    }
};


Grid.prototype.setDim = function (nbCols, nbRows) {
    "use strict";

    this.nbCols = nbCols;
    this.nbRows = nbRows;
    this.initMatrix(nbCols, nbRows);
    this.selectedNeighbor = this.generateMatrix(this.nbCols, this.nbRows);
};

Grid.prototype.setMode = function (newMode) {
    this.mode = newMode;
    this.initMatrix(this.nbCols, this.nbRows);
};