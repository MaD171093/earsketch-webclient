// JavaScript source code
var parentLineNumber = 0;
var studentCode = [];
var originalityLines = [], makeBeatRenames = [], userFunctionRenames = [], loopLocations = [], userFunctionParameters = [], flaggedReturns = [], forLoopFuncs = [], uncalledFunctionLines = [];
var takesArgs = false, returns = false, thisSequenceAlreadyCounted = false;
var isJavascript = false;
var allVariables, functionLines, dataTypes, listFuncs, strFuncs, createListFuncs, createStrFuncs, userFunctionReturns;
var apiCalls;
var allCalls;
var lineDictionary;
var allConditionals;
var variableAssignments;
var results;