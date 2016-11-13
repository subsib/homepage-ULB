/**
 * Created by Arabella Brayer on 8/11/2016.
 */

function Grid(nbCols, nbRows, T, R, P, S, mode) {
    "use strict";

    this.setDim(nbCols, nbRows);
    this.initMatrix(nbCols, nbRows); // init this.cellMatrix
    this.t = T;
    this.r = R;
    this.p = P;
    this.s = S;
    this.mode = mode;
}

Grid.prototype.initMatrix = function (nbCols, nbRows) {
    "use strict";

    this.cellMatrix = this.generateMatrix(nbCols, nbRows);

    this.cleanCount();
    for (var i=0; i < nbCols; i++) {
        for(var j=0; j < nbRows; j++) {
            var state = Math.round(Math.random()+1);
            if(state == COOPSTATE){
                this.nbCoops++;
            } else {
                this.nbDefect++;
            }
            this.cellMatrix[i][j].setState(state);
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
    if(this.mode == MOORE){
        this.mode = VN;
    } else {
        this.mode = MOORE;
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

    delete this.cellMatrix[x][y];
};


Grid.prototype.doCooperate = function (x, y) {
    "use strict";

    console.assert(Number.isInteger(x), x);
    console.assert(Number.isInteger(y), y);

    this.cellMatrix[x][y].setState(COOPSTATE);
};

Grid.prototype.getCeilX = function (x) {
    "use strict";

    return Math.min(this.nbCols - 1, x + 1);
};


Grid.prototype.getCeilY = function (y) {
    "use strict";

    return Math.min(this.nbRows - 1, y + 1);
};

Grid.prototype.getFloorX = function (x) {
    "use strict";

    return Math.max(0, x - 1);
};

Grid.prototype.getFloorY = function (y) {
    "use strict";

    return Math.max(0, y - 1);
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

    return (this.cellMatrix[x][y].state == COOPSTATE);
};

/**
 * Compute the scores for all cell in the matrix.
 */
Grid.prototype.computeScores = function () {
    "use strict";
// TODO Priority on the development of this part
    var x;
    var y;
    for(x=0; x < this.nbCols; x++){
        for(y=0; y < this.nbRows; y++){
            this.cellMatrix[x][y].score = this.computeScore(x, y);
        }
    }
};

Grid.prototype.isMooreMode = function () {
    return this.mode == MOORE;
};

Grid.prototype.computeScore = function (x, y) {
    "use strict";

    if(this.isMooreMode()){
        return this.computeScoreMoore(x, y);
    } else {
        return this.computeScoreVonNeumann(x, y);
    }
};

Number.prototype.mod = function(n) {
    var m = (( this % n) + n) % n;
    return m < 0 ? m + Math.abs(n) : m;
};

Grid.prototype.computeScoreMoore = function (x, y) {
    "use strict";

    for(var countx = -1; countx <= 1; countx++){
        for(var county = -1; county <= 1; county++){
            if (!(countx == 0 && county == 0)){
            // console.log("print i" + ((i + countx).mod(this.nbCols)) + " and " + "print j" + ((j + county).mod(this.nbRows)));
                this.cellMatrix[x][y].addScore(this.getScore(this.cellMatrix[x][y], this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)]));
                console.log("cell xy: "+x+":"+y+ this.getScore(this.cellMatrix[x][y], this.cellMatrix[(x + countx).mod(this.nbCols)][(y + county).mod(this.nbRows)]));
            }
        }
    }
};

Grid.prototype.getScore = function (action1, action2) {
    if(action1 == COOPSTATE){
        if(action2 == COOPSTATE){
            return this.r;
        } else { // player 2 defects
            return this.s;
        }
    } else { // player 1 defects
        if(action2 == COOPSTATE){
            return this.t;
        } else {
            return this.p;
        }
    }
};

Grid.prototype.computeScoreVonNeumann = function (x, y) {
    "use strict";


};

Grid.prototype.betterNeighbor = function (x, y) {
    // TODO refactorign total
    "use strict";

    console.assert(Number.isInteger(x), x);
    console.assert(Number.isInteger(y), y);

    var maxi = 0;
    var action = NOACTION;
    var i;
    var j;

    for (j = this.getFloorY(y); j <= this.getCeilY(y); ++j) {
        for (i = this.getFloorX(x); i <= this.getCeilX(x); ++i) {
            if ((i !== x || j !== y) && this.cellMatrix[x][y].score > maxi) {
                maxi = this.cellMatrix[x][y].score;
                action = this.cellMatrix[x][y].state;
            }
        }
    }

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
            line += (this.cooperate(x, y) ? "x" : ".");
        }
        console.log(line);
    }
};

Grid.prototype.printScores = function () {
    "use strict";

    var x;
    var y;
    var line;
    var nb;

    for (y = 0; y < this.getNbRows(); ++y) {
        line = (y < 10 ? " " : "") + y + "|";
        for (x = 0; x < this.getNbCols(); ++x) {
            line += (this.cellMatrix[x][y].score + "-");
        }
        console.log(line);
    }
};


Grid.prototype.setDim = function (nbCols, nbRows) {
    "use strict";

    this.nbCols = nbCols;
    this.nbRows = nbRows;
    this.initMatrix(nbCols, nbRows);
};

Grid.prototype.setMode = function (newMode) {
    this.mode = newMode;
    this.initMatrix(this.nbCols, this.nbRows);
};