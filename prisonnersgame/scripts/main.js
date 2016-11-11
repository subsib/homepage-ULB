/**
 * Created by Arabella Brayer on 8/11/2016.
 */

// global vars
var TMINUS = 1;
var TPLUS = 2;
var RMINUS = 3;
var RPLUS = 4;
var PMINUS = 5;
var PPLUS = 6;
var SMINUS = 7;
var SPLUS = 8;


(function () {
    "use strict";

    var DEFAULT_NB_COLS = 50;
    var DEFAULT_NB_ROWS = 50;
    // var DEFAULT_RATE_OF_COOPERATE = 0.5; // TODO add this option, after...
    var DEFAULT_T = 10;
    var DEFAULT_R = 7;
    var DEFAULT_P = 0;
    var DEFAULT_S = 0;

    var prisonner;



    function CreateWindow() {
        var grid = new Grid(DEFAULT_NB_COLS, DEFAULT_NB_ROWS, DEFAULT_T, DEFAULT_R, DEFAULT_P, DEFAULT_S);
        var view = new GridView(this, grid, DEFAULT_NB_COLS, DEFAULT_NB_ROWS);

        this.controller = new GridController(grid, view);
        console.log("CreatePrisonner grid ok");
    }

    function changeParams(paramsForm) {
        console.assert(paramsForm instanceof HTMLElement, paramsForm);

        var nbCols = parseInt(paramsForm.nbCols.value, 10);
        var nbRows = parseInt(paramsForm.nbRows.value, 10);
        prisonner.controller.setDim(nbCols, nbRows);
        console.log("Data updated : cols = " + nbCols + " rows = " + nbRows);
    }

    function changePayoffs(selectedVar) {
        prisonner.controller.modifPayoff(selectedVar);
        console.log("changePayoffs done");
    }

    function forward(gapForm) {
        console.assert(gapForm instanceof HTMLElement, gapForm);

        var nbSteps = parseInt(gapForm.steps.value, 10);
        var i;

        for (i = 0; i < nbSteps; ++i) {
            prisonner.controller.nextStep();
        }
    }


    function setListeners() {
        document.getElementById("changeParamsButton")
            .addEventListener("click",
                function () {
                    changeParams(document.getElementById("paramsForm"));
                },
                false);
// table buttons
        document.getElementById("tMinus")
            .addEventListener("click",
                function () {
                    changePayoffs(TMINUS);
                },
                false);

        document.getElementById("tPlus")
            .addEventListener("click",
                function () {
                    changePayoffs(TPLUS);
                },
                false);

        document.getElementById("rMinus")
            .addEventListener("click",
                function () {
                    changePayoffs(RMINUS);
                },
                false);

        document.getElementById("rPlus")
            .addEventListener("click",
                function () {
                    changePayoffs(RPLUS);
                },
                false);

        document.getElementById("pMinus")
            .addEventListener("click",
                function () {
                    changePayoffs(PMINUS);
                },
                false);

        document.getElementById("pPlus")
            .addEventListener("click",
                function () {
                    changePayoffs(PPLUS);
                },
                false);

        document.getElementById("sMinus")
            .addEventListener("click",
                function () {
                    changePayoffs(SMINUS);
                },
                false);

        document.getElementById("sPlus")
            .addEventListener("click",
                function () {
                    changePayoffs(SPLUS);
                },
                false);
// end table buttons

        document.getElementById("forwardButton")
            .addEventListener("click",
                function () {
                    forward(document.getElementById("gapForm"));
                },
                false);

        document.getElementById("printMatrixButton")
            .addEventListener("click",
                function () {
                    prisonner.controller.model.printMatrix();
                },
                false);

        document.getElementById("printNbNeighborsAliveButton")
            .addEventListener("click",
                function () {
                    prisonner.controller.model.printNbCooperatingNeighbors();
                },
                false);
    }



    /* Main */
    window.addEventListener("load",
        function () {
            prisonner = new CreateWindow();
            prisonner.controller.createGrid();
            prisonner.controller.update();
//
//             // Set interface
            var paramsForm = document.getElementById("paramsForm");
//
            paramsForm.nbCols.value = prisonner.controller.model.getNbCols();
            paramsForm.nbRows.value = prisonner.controller.model.getNbRows();

            // set interface table
            document.getElementById("tContent").innerHTML = prisonner.controller.model.t;
            document.getElementById("pContent").innerHTML = prisonner.controller.model.p;
            document.getElementById("rContent").innerHTML = prisonner.controller.model.r;
            document.getElementById("sContent").innerHTML = prisonner.controller.model.s;

            setListeners();
        },
        false);
}());