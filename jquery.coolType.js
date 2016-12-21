(function ($) {

    var defaults = {
        typeSpeed: 10,
        inline: true,
        cursorChar: '&#9608;',
        cursorBlinkSpeed: 300,
        delayBeforeType: 1000,
        delayAfterType: 3000,
        onComplete: false,
        onBeforeType: false,
        onAfterType: false,
        typeHTML:false,  
        expansions: [
            '&nbsp;',
            '&gt;',
            '&lt;',
            '&quot;',
            '&amp;'
        ]
    };
    
    class TextTypeNode{
        constructor(tag, text, tagAttrib, parentNode,id) {
           this.tag = tag;
           this.tagAttrib = tagAttrib;
           this.text = text;
           this.parentNode = parentNode;
           this.id = id;

      } 
    }

    $.fn.coolType = function (text, options) {
        var $this = this,
            settings = $.extend({}, defaults, options),
            $container = $('<span>'),
            $baseNode = $container,
            $myId="ctt",
            $htmlTags= [],
            $textIndex = 0,
            $appendToContainer = null,
            $cursor = $('<span>')
                .css({
                    paddingLeft: 3,
                    display: settings.inline ? 'inline' : 'block'
                })
                .html(settings.cursorChar)
                .hide();

        $container.appendTo($this);
        $cursor.appendTo($this);

        function startBlinking() {
            $cursor.data('intervalId', setInterval(function () {
                $cursor.toggle();
            }, settings.cursorBlinkSpeed));
        }

        function stopBlinking() {
            clearInterval($cursor.data('intervalId'));
        }

        function expandChar(charIndex) {
            var char = text[charIndex];
            for (var expansionIndex in settings.expansions) {
                var expansion = settings.expansions[expansionIndex];
                if (expansion[0] === char) {
                    var textToCompare = text.substr(charIndex, expansion.length);
                    if (textToCompare === expansion)
                        return { char: expansion, charIndex: charIndex + (expansion.length - 1) };
                }
            }
            return { char: char, charIndex: charIndex };
        }
        
   // begin HTML cooltype functions
        function makeNode(nodeName, nodeText, tagAttrib,parentNode, id){
       
       //var htmlTag = nodeName == '#text' ? "" : nodeName;
        
       return new TextTypeNode(nodeName == '#text' ? "" : nodeName,
                               nodeText, tagAttrib,parentNode,id);
     
 }        
    
        function genID(myKey, seedNum){
             var key = myKey + seedNum;
             if (document.getElementById(key) != null){
                 return genID(myKey, ++seedNum)
             }
             else{
                 return key;
             }
         }
          
        function parseMe(nodeHTML, parentNode){
    
     
     $.each( nodeHTML, function( i, el ) { //main parseMe element loop
    
            var nodeAtribs = "",
            htmlTag = el.nodeName,
            htmlText = "",
            idSelector = null;
            if ( el.nodeName != '#text'){
                $.each( el.attributes, function( i, at) {
                    nodeAtribs =nodeAtribs + at.nodeName + '="' + at.value +'" ';
                    if (at.nodeName == "id"){idSelector=at.nodeValue;}
                });
               
            }else{
                htmlText =  el.data;
            }
         
            if (idSelector == null){ 
                    idSelector= genID($myId, parseMe.nodeCount)
                    nodeAtribs =nodeAtribs + 'id="' + idSelector +'" ';
            }
         
            var thisNode = makeNode(htmlTag,htmlText,nodeAtribs, parentNode, idSelector);       
            $htmlTags[parseMe.nodeCount] = thisNode; 
            parseMe.nodeCount++; 
         
           for (var nodeCnt=0;nodeCnt < el.childNodes.length; nodeCnt++){//child node loop
               
               if(el.childNodes[nodeCnt].nodeName != '#text'){
                    parseMe($.parseHTML(el.childNodes[nodeCnt].outerHTML),thisNode);
               }else{
                    var node = $htmlTags[parseMe.nodeCount] = makeNode(el.childNodes[nodeCnt].nodeName,
                              el.childNodes[nodeCnt].data,
                              "",
                              thisNode, 
                              genID($myId, parseMe.nodeCount));       
                    $htmlTags[parseMe.nodeCount] = node; 
                    parseMe.nodeCount++;
              }
                
           } //end child node loop
         
     }); //end main parseMe element loop

 }
          
        function findNext(next){
    
    if (next < $htmlTags.length) {
       return ++next;
    }else{
        return -1
    }
}
 
        function processTags(indx){
         // recursivly appends all the tabs to the active container
         // sets the active container global variable

           var myParentId= $htmlTags[indx].parentNode == null? '' :$htmlTags[indx].parentNode.id;
           if ( $htmlTags[indx].tag !=""){
                    var subContainer = $("<" +$htmlTags[indx].tag + " " + $htmlTags[indx].tagAttrib +">");

                    $appendToContainer = myParentId !== ''?$("#"+myParentId):$baseNode;
                    if ($appendToContainer != null){
                        subContainer.appendTo($appendToContainer);
                        $appendToContainer = subContainer;
                     }
               $textIndex=indx;
           }

           var nextNode=findNext(indx);
           if (nextNode>0){
               if($htmlTags[nextNode].tag !=""){
                   processTags(nextNode);
               }
           }
        }
        
        function noMoreBlinke(){
        //DRY: copied and pasted from writeText. WriteHTML had a couple of exit points and this was common code with WriteText so I copied this code block here    
            if (settings.onAfterType) settings.onAfterType();
                    if (settings.delayAfterType > 0) {
                        startBlinking();
                        setTimeout(function () {
                            stopBlinking();
                            $cursor.remove();
                            if (settings.onComplete) settings.onComplete();
                        }, settings.delayAfterType);
                    }
                    else {
                        $cursor.remove();
                        if (settings.onComplete) settings.onComplete();
                    }
        }
        
        function typeHTML() {
            if (settings.onBeforeType) settings.onBeforeType();
            var charIndex = 0;
            $baseNode = $container;
            parseMe.nodeCount = 0;  
            var html = $.parseHTML(text);
            parseMe(html, null);

            var intervalId = setInterval( function(){
    
            if (($textIndex<0)||($textIndex >= $htmlTags.length)){
                  clearInterval(intervalId);
                  noMoreBlinke();
                  return;
            }

            if ($htmlTags[$textIndex].tag !=""){
                processTags($textIndex);
                charIndex = 0;
                $textIndex=findNext($textIndex);
            }

            if ($textIndex>=0){
                $text = $htmlTags[$textIndex].text;
                if (charIndex>= $text.length){
                     $textIndex = findNext($textIndex);
                     charIndex = 0; // yup we skip a beat here - wait till next interval to process 
                }else{
                    //var char = ;
                    var myParentId= $htmlTags[$textIndex].parentNode == null? '' : $htmlTags[$textIndex].parentNode.id;
                    if (myParentId!=''){
                        $("#"+myParentId).append($text[charIndex]);
                        $cursor.appendTo("#"+myParentId);
                    }
                    else{
                        $baseNode.append($text[charIndex]);
                        $cursor.appendTo($baseNode);
                    }
                    charIndex++;
                }

              }else
                {
                   clearInterval(intervalId); 
                    noMoreBlinke();
                }

           } , settings.typeSpeed);
        }

   // end  HTML cooltype functions 
        
        function typeText() {
            if (settings.onBeforeType) settings.onBeforeType();
            var charIndex = 0;
            var intervalId = setInterval(function () {
                var expanded = expandChar(charIndex),
                    char = expanded.char;
                charIndex = expanded.charIndex;
                $container.append(char);
                charIndex++;
                if (charIndex === text.length) {
                    clearInterval(intervalId);
                    noMoreBlinke();
                }
            }, settings.typeSpeed);
        }

        if (settings.delayBeforeType > 0) {
            $cursor.show();
            startBlinking();
            setTimeout(function () {
                stopBlinking();
                $cursor.show();
                if (!settings.typeHTML){
                    typeText(); 
                }else{
                    typeHTML();
                }
            }, settings.delayBeforeType);
        }
        else {
            $cursor.show();
            if (!settings.typeHTML){
                    typeText(); 
                }else{
                    typeHTML();
                }
        }
        
     return $this.each(function(){}
                       );
    };
   
})(jQuery);
