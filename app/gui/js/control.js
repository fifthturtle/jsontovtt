var vm = new Vue({
    el : '#app',
    data: {
        myLog : log,
        filePath : '',
        dragOver : dragOver
    },
    methods : {
        clearLog : function()
        {
            while (log.length) log.pop();
        },
        folderSelect : function(path)
        {
            dialog.showOpenDialog({
                title : `Select Folder`,
                properties : ['openDirectory'],
                message : 'Choose Folder to store VTT files'
            }, (filePaths) => {
                this.filePath = filePaths.shift();
                store.set('saveFolder', this.filePath);
            })
        },
        getBG : function()
        {
            return (this.dragOver) ? "dragOver" : "noDrag";
        }
    },
    created : function()
    {
        this.filePath = store.get('saveFolder');
    },
    template : `
    <div>
        <div class="header">
            <label @click="folderSelect()">Watch Folder: 
                <input type="text" disabled="true" v-model="filePath" class="watchFolderInput">
                <img src="images/open-folder.png" height="20px" width="20px" class="watchFolderImage"></img>
            </label>
        </div>
        <div id="drop">
            <div id="dropHere" ondrop="drop(event)" ondragover="allowDrop(event)" :class="getBG()" v-if="filePath.length">
                DROP JSON FILE HERE
            </div>
        </div>
        <div id="process" v-if="myLog.length">
            <button @click="clearLog()">Clear Log</button>
            <div class="log">
                <div v-for="log in myLog" :class="log.msgType" class="logMessage">{{log.msg}}</div>
            </div>
        </div>
    </div>
    `
});