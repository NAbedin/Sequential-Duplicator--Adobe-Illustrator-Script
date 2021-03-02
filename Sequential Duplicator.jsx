var doc = app.activeDocument;
// locate group named template
var template = groupTemplateFinder();
// initialize variables
var copiesPerRow;
var firstNumString;
var lastNumString;


// ----- Main Window -----
var popup = new Window('dialog', 'Sequential Duplicator');

// instructions panel
var instructionGroup = popup.add('panel', undefined, 'Instructions');
    instructionGroup.orientation = 'column';
    instructionGroup.alignChildren = ['center', 'center'];
    instructionGroup.margins = [14, 10, 13, 10];
    instructionGroup.spacing = 0;

var instructions = instructionGroup.add(
    'statictext', 
    undefined, 
    '\u2022 Artwork must be grouped\n\u2022 Group must be named: template\n\u2022 Text layer in group must be \n   named: replace\n\u2022 Increase Total Digits to add \n   leading zero\'s',
    {multiline:true}
);
// first and last number input panel
var firstLastPanel = popup.add('panel', undefined, 'Input Numbers');
    firstLastPanel.margins = [48, 15, 47, 15];
    firstLastPanel.spacing = 15;
// first number input box
var firstInput = firstLastPanel.add('group');
    firstInput.add('statictext', undefined, 'First:');

var firstNum = firstInput.add('edittext', undefined, '');
    firstNum.characters = 8;
    firstNum.active = true;
// last number input box
var lastInput = firstLastPanel.add('group');
    lastInput.add('statictext', undefined, 'Last:');

var lastNum = lastInput.add('edittext', undefined, '');
    lastNum.characters = 8;
// formatting panel
var formatGroup = popup.add('panel', undefined, 'Format Output');
    formatGroup.margins = [26, 15, 26, 15];
    formatGroup.spacing = 15;
    formatGroup.alignChildren = 'left';
// input for number of new groups allowed per row
var formatOutput = formatGroup.add('group');
    formatOutput.orientation = 'row';
    formatOutput.add('statictext', undefined, 'Row Length: ');

var rowInput = formatOutput.add('edittext', undefined, '10');
    rowInput.characters = 8;
// dividing line                
    formatGroup.add('panel', [0,0,165,2]);
// input for leading zero's
    formatGroup.add('statictext', undefined, 'Leading Zero\'s');

var fillZeros = formatGroup.add('group');
    fillZeros.add('statictext', undefined, 'Total Digits: ');
    
var fillZeroInput = fillZeros.add('edittext', undefined, '1');
    fillZeroInput.characters = 8;
// buttons
var buttonGroup = popup.add('group');
    buttonGroup.orientation = 'row';

var okButton = buttonGroup.add('button', undefined, 'OK');
    okButton.onClick = main;

var cancelButton = buttonGroup.add('button', undefined, 'Cancel');
// copyright information
var copyright = popup.add('group');
    copyright.orientation = 'column';
    copyright.spacing = 0;
    copyright.add('statictext', undefined, '\u00A9 Nazanin Abedin');
    copyright.add('statictext', undefined, 'www.nazaninabedin.com');
    copyright.enabled = false;





// ----- Run -----
// display the window    
popup.show();

// ok button function
function main() {
    // convert inputs
    firstNumString = firstNum.text;
    lastNumString = lastNum.text;

    fillZeroInput = fillZeroInput.text;
    fillZeroInput = parseInt(fillZeroInput);

    firstNum = firstNum.text;
    firstNum = parseInt(firstNum);

    lastNum = lastNum.text;
    lastNum = parseInt(lastNum);

    copiesPerRow = rowInput.text;
    copiesPerRow = parseInt(copiesPerRow);
    // generate sequence
    genOutput();
    //close the window
    popup.close();
}

// ----- Group Template Finder -----
function groupTemplateFinder() {
    for(var i = 0; i < doc.groupItems.length;  i++){
        if (doc.groupItems[i].name == "template"){
            return doc.groupItems[i];
        }
    }
}

// ----- Generated Output -----
function genOutput() {
    // create new group
    var newGroup = doc.groupItems.add();
        newGroup.name = 'Generated: ' + firstNum + ' - ' + lastNum;
        newGroup.move ( doc, ElementPlacement.PLACEATEND );
    // get target group width and height
    var groupWidth = template.width;
    var groupHeight = template.height;

    var startX = groupWidth + 20;
    var startY = 0;

    var newItemX = startX;
    var newItemY = startY;

    var rowCounter = 1;

    var textLayer = template.textFrames.getByName("replace");
    // first and last input numbers determin number of loops
    while (firstNum <= lastNum) {
        // restrict how many new groups appear per row
        if (rowCounter > copiesPerRow) {
            newItemY = newItemY - groupHeight - 20;
            newItemX = startX;
            rowCounter = 1;
        }

        var zeroPrefix = "";
        var zeroPrefixCount = fillZeroInput - firstNum.toString().length;        
        // generate leading zero's
        for (i = 0; i < zeroPrefixCount; i++) {
            zeroPrefix = zeroPrefix + "0";
        }
        // rename new group and the target text layer to current numerical iteration
        template.name = zeroPrefix + firstNum;
        textLayer.name = zeroPrefix + firstNum;
        // locate target text frame in original group and change contents to combined zero prefix and current numerical iteration
        textLayer.contents = zeroPrefix + firstNum.toString();
        // duplicate modified group and position placement
        template.duplicate( newGroup, ElementPlacement.PLACEATEND ).translate(newItemX, newItemY);
        // update location for each generated group
        newItemX = newItemX + groupWidth + 20;

        firstNum++;
        rowCounter++;
    }
    // rename group and text layer to original names
    template.name = 'template';
    textLayer.name = 'replace';

}