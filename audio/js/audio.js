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
                    <svg width="18" height="24" viewBox="0 0 18 24">
                        <path fill="#086745" fill-rule="evenodd" d="M18 12L0 24V0" class="play-pause-icon" id="playPause">
                    </svg>
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
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path fill="#566574" fill-rule="evenodd"
                                d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z"
                                id="speaker">
                        </svg>
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

                <audio>
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
            audioPlayer.element.playPause.attributes.d.value = "M18 12L0 24V0";
            audioPlayer.element.player.currentTime = 0;
        });

        audioPlayer.element.volumeBtn.addEventListener('click', function () {
            audioPlayer.element.volumeBtn.classList.toggle('open');
            audioPlayer.element.volumeControls.classList.toggle('hidden');
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
            audioPlayer.element.speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
        } else if (audioPlayer.element.player.volume < 0.5 && audioPlayer.element.player.volume > 0.05) {
            audioPlayer.element.speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
        } else if (audioPlayer.element.player.volume <= 0.05) {
            audioPlayer.element.speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
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
            audioPlayer.element.playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
            audioPlayer.element.player.play();
        } else {
            audioPlayer.element.playPause.attributes.d.value = "M18 12L0 24V0";
            audioPlayer.element.player.pause();
        }
    },
    makePlay:function(){
        audioPlayer.element.playpauseBtn.style.display = 'block';
        audioPlayer.element.loading.style.display = 'none';
    },
    directionAware:function(){
        if (window.innerHeight < 250) {
            audioPlayer.element.volumeControls.style.bottom = '-54px';
            audioPlayer.element.volumeControls.style.left = '54px';
        } else if (audioPlayer.element.audioPlayeroffsetTop < 154) {
            audioPlayer.element.volumeControls.style.bottom = '-164px';
            audioPlayer.element.volumeControls.style.left = '-3px';
        } else {
            audioPlayer.element.volumeControls.style.bottom = '52px';
            audioPlayer.element.volumeControls.style.left = '-3px';
        }
    }
}
