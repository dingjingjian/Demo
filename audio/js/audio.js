/* 播放组件参数 options*/
//elem dom容器的选择器
//source 资源地址 数组合集

var audioPlayer = {
    render:function(options){
        document.querySelector(options.elem).innerHTML=`
            <div class="audio green-audio-player">
                <!-- loading -->
                <div class="loading">
                    <div class="spinner"></div>
                </div>
                <!-- 播放&暂停 -->
                <div class="play-pause-btn">
                	<i id="playPause" class="iconfont">`+(options.autoplay?'&#xe619;':'&#xe63a;')+`</i>
                </div>
                <!-- 播放进度条&时间 -->
                <div class="controls">
                    <div class="slider" data-direction="horizontal">
                        <div class="progress">
                            <div class="pin" id="progress-pin" data-method="rewind"></div>
                        </div>
                    </div>
                    <span class="current-time">0:00</span>/
                    <span class="total-time">0:00</span>
                </div>
                <!-- 音量键 -->
                <div class="volume">
                    <div class="volume-btn">
                    	<div id="speaker"> </div>
                    </div>
                    <!-- 音量大小控制条 -->
                    <div class="volume-controls hidden">
                        <div class="slider" data-direction="vertical">
                            <div class="progress">
                                <div class="pin" id="volume-pin" data-method="changeVolume"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <audio `+(options.autoplay?'autoplay="autoplay"':'')+`>
                    <source src="`+options.source+`" type="audio/mpeg">
                </audio>
            </div>
        `
        audioPlayer.element.audioPlayer = document.querySelector('.green-audio-player');
        audioPlayer.element.playPause=audioPlayer.element.audioPlayer.querySelector('#playPause'),
        audioPlayer.element.playpauseBtn=audioPlayer.element.audioPlayer.querySelector('.play-pause-btn'),
        audioPlayer.element.loading=audioPlayer.element.audioPlayer.querySelector('.loading'),
        audioPlayer.element.progress=audioPlayer.element.audioPlayer.querySelector('.progress'),
        audioPlayer.element.sliders=audioPlayer.element.audioPlayer.querySelectorAll('.slider'),
        audioPlayer.element.volumeBtn=audioPlayer.element.audioPlayer.querySelector('.volume-btn'),
        audioPlayer.element.volumeControls=audioPlayer.element.audioPlayer.querySelector('.volume-controls'),
        audioPlayer.element.volumeProgress=audioPlayer.element.volumeControls.querySelector('.slider .progress'),
        audioPlayer.element.player=audioPlayer.element.audioPlayer.querySelector('audio'),
        audioPlayer.element.currentTime=audioPlayer.element.audioPlayer.querySelector('.current-time'),
        audioPlayer.element.totalTime=audioPlayer.element.audioPlayer.querySelector('.total-time'),
        audioPlayer.element.speaker=audioPlayer.element.audioPlayer.querySelector('#speaker')
        
        audioPlayer.eventListener();
        audioPlayer.directionAware();
    },
    element:{
        audioPlayer:'',
        playPause:'',
        playpauseBtn:'',
        loading:'',
        progress:'',
        sliders:'',
        volumeBtn:'',
        volumeControls:'',
        volumeProgress:'',
        player:'',
        currentTime:'',
        totalTime:'',
        speaker:''
    },
    currentlyDragged:null,
    eventListener:function(){
        window.addEventListener('mousedown', function (event) {

            if (!audioPlayer.isDraggable(event.target)) return false;

            audioPlayer.currentlyDragged = event.target;

            var handleMethod = audioPlayer.currentlyDragged.dataset.method;

            this.addEventListener('mousemove', eval(audioPlayer[handleMethod]), false);

            window.addEventListener('mouseup', function () {
                audioPlayer.currentlyDragged = false;
                window.removeEventListener('mousemove',  eval(audioPlayer[handleMethod]), false);
            }, false);
        });

        audioPlayer.element.playpauseBtn.addEventListener('click', audioPlayer.togglePlay);
        audioPlayer.element.player.addEventListener('timeupdate', audioPlayer.updateProgress);
        audioPlayer.element.player.addEventListener('volumechange', audioPlayer.updateVolume);
        audioPlayer.element.player.addEventListener('loadedmetadata', function () {
            audioPlayer.element.totalTime.textContent = audioPlayer.formatTime(audioPlayer.element.player.duration);
        });
        audioPlayer.element.player.addEventListener('canplay', audioPlayer.makePlay);
        audioPlayer.element.player.addEventListener('ended', function () {
            audioPlayer.element.playPause.innerHTML  = "&#xe63a;";
            audioPlayer.element.player.currentTime = 0;
        });

        audioPlayer.element.volumeBtn.addEventListener('click', function () {
        	audioPlayer.directionAware();
            audioPlayer.element.volumeBtn.classList.toggle('open');
            audioPlayer.element.volumeControls.classList.toggle('hidden');
        });
        
        audioPlayer.element.volumeControls.addEventListener('mouseout', function (e) {
            if(e.relatedTarget.className!='slider'&&e.relatedTarget.className!='volume-controls'&&e.relatedTarget.className!='pin'){
            	audioPlayer.element.volumeBtn.classList.remove('open');
                audioPlayer.element.volumeControls.classList.add('hidden');
            }
        });

        window.addEventListener('resize', audioPlayer.directionAware);

        audioPlayer.element.sliders.forEach(function (slider) {
            var pin = slider.querySelector('.pin');
            slider.addEventListener('click', eval(audioPlayer[pin.dataset.method]));
        });
    },
    isDraggable:function(el){
        var draggableClasses = ['pin'];
        var canDrag = false;
        var classes = Array.from(el.classList);
        draggableClasses.forEach(function (draggable) {
            if (classes.indexOf(draggable) !== -1) canDrag = true;
        });
        return canDrag;
    },
    inRange:function(event){
        var rangeBox = audioPlayer.getRangeBox(event);
        var rect = rangeBox.getBoundingClientRect();
        var direction = rangeBox.dataset.direction;
        if (direction == 'horizontal') {
            var min = rangeBox.offsetLeft;
            var max = min + rangeBox.offsetWidth;
            if (event.clientX < min || event.clientX > max) return false;
        } else {
            var min = rect.top;
            var max = min + rangeBox.offsetHeight;
            if (event.clientY < min || event.clientY > max) return false;
        }
        return true;
    },
    updateProgress:function(){
        var current = audioPlayer.element.player.currentTime;
        var percent = current / audioPlayer.element.player.duration * 100;
        audioPlayer.element.progress.style.width = percent + '%';
        audioPlayer.element.currentTime.textContent = audioPlayer.formatTime(current);
    },
    updateVolume:function(){
        /* 音量大小改变svg图片 */
        audioPlayer.element.volumeProgress.style.height = audioPlayer.element.player.volume * 100 + '%';
        if (audioPlayer.element.player.volume >= 0.5) {
        	$(audioPlayer.element.speaker).removeClass('mid')
        	$(audioPlayer.element.speaker).removeClass('min')
        } else if (audioPlayer.element.player.volume < 0.5 && audioPlayer.element.player.volume > 0.05) {
        	$(audioPlayer.element.speaker).addClass('mid')
        	$(audioPlayer.element.speaker).removeClass('min')
        } else if (audioPlayer.element.player.volume <= 0.05) {
        	$(audioPlayer.element.speaker).addClass('min')
        	$(audioPlayer.element.speaker).removeClass('mid')
        }
    },
    getRangeBox:function(event){
        var rangeBox = event.target;
        var el = audioPlayer.currentlyDragged;
        if (event.type == 'click' && audioPlayer.isDraggable(event.target)) {
            rangeBox = event.target.parentElement.parentElement;
        }
        if (event.type == 'mousemove') {
            rangeBox = el.parentElement.parentElement;
        }
        return rangeBox;
    },
    getCoefficient:function(event){
        var slider = audioPlayer.getRangeBox(event);
        var rect = slider.getBoundingClientRect();
        var K = 0;
        if (slider.dataset.direction == 'horizontal') {
    
            var offsetX = event.clientX - slider.offsetLeft;
            var width = slider.clientWidth;
            K = offsetX / width;
        } else if (slider.dataset.direction == 'vertical') {
    
            var height = slider.clientHeight;
            var offsetY = event.clientY - rect.top;
            K = 1 - offsetY / height;
        }
        return K;
    },
    rewind:function(event){
        if (audioPlayer.inRange(event)) {
            audioPlayer.element.player.currentTime = audioPlayer.element.player.duration * audioPlayer.getCoefficient(event);
        }
    },
    changeVolume:function(event){
        if (audioPlayer.inRange(event)) {
            audioPlayer.element.player.volume = audioPlayer.getCoefficient(event);
        }
    },
    formatTime:function(time){
        var min = Math.floor(time / 60);
        var sec = Math.floor(time % 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
    },
    togglePlay:function(){
        if (audioPlayer.element.player.paused) {
            audioPlayer.element.playPause.innerHTML  = "&#xe619;";
            audioPlayer.element.player.play();
        } else {
            audioPlayer.element.playPause.innerHTML  = "&#xe63a;";
            audioPlayer.element.player.pause();
        }
    },
    makePlay:function(){
        audioPlayer.element.playpauseBtn.style.display = 'block';
        audioPlayer.element.loading.style.display = 'none';
        if(audioPlayer.element.player.paused){
    		audioPlayer.element.playPause.innerHTML  = "&#xe63a;";
    	}
    },
    directionAware:function(){
        if (window.innerHeight < 250) {
            audioPlayer.element.volumeControls.style.bottom = '-54px';
            audioPlayer.element.volumeControls.style.left = '54px';
        } else if (audioPlayer.element.audioPlayer.offsetTop < 154) {
            audioPlayer.element.volumeControls.style.bottom = '-164px';
            audioPlayer.element.volumeControls.style.left = '-7px';
        } else {
            audioPlayer.element.volumeControls.style.bottom = '52px';
            audioPlayer.element.volumeControls.style.left = '-7px';
        }
    }
}
