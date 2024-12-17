/* 
1. Render songs
2. Scroll top
3. Play / Pause / seek
4. CD rotate
5. Next / Prev
6. Random
7. Next / Repeat when ended
8. Active song
9. Scroll active song into view 
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    //Làm thêm nhưng chưa dùng đến
    config: JSON.parse(localStorage.getItem( PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chỉ Bằng Cái Gật Đầu',
            singer: 'Yan Nguyễn',
            path: './music/Chỉ Bằng Cái Gật Đầu.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Dạ Vũ',
            singer: 'Tăng Duy Tân',
            path: './music/Dạ Vũ.mp3',
            image: './img/song7.jpg'
        },
        {
            name: 'Khi Người Mình Yêu Khóc',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/Khi Người Mình Yêu Khóc.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'Khi Phải Quên Đi',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/Khi Phải Quên Đi.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Cắt Đôi Nỗi Sầu',
            singer: 'Tăng Duy Tân',
            path: './music/Cắt Đôi Nỗi Sầu.mp3',
            image: './img/song5.jpg'
        },
        {
            name: 'Em Ơi Đừng Khóc',
            singer: 'Tăng Duy Tân',
            path: './music/Em Ơi Đừng Khóc.mp3',
            image: './img/song6.jpg'
        },
        {
            name: 'Tình Em Là Đại Dương',
            singer: 'Duy Mạnh',
            path: './music/Tình Em Là Đại Dương.mp3',
            image: './img/song2.jpg'
        },
        {
            name: 'Bông Hoa Đẹp Nhất',
            singer: 'Quân A.P',
            path: './music/Bông Hoa Đẹp Nhất.mp3',
            image: './img/song8.jpg'
        },
        {
            name: 'Dạ Vũ 2',
            singer: 'Tăng Duy Tân',
            path: './music/Dạ Vũ.mp3',
            image: './img/song7.jpg'
        },
        {
            name: 'Khi Phải Quên Đi 2',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/Khi Phải Quên Đi.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Tình Em Là Đại Dương 2',
            singer: 'Duy Mạnh',
            path: './music/Tình Em Là Đại Dương.mp3',
            image: './img/song2.jpg'
        }
    ],

    //Làm thêm nhưng chưa dùng đến
    setConfig: function (key, value) {  
        this.config[key] = value;
        localStorage.setItem( PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function () {
        const cd = $('.cd');       
        const cdWidth = cd.offsetWidth;

        //Xử lý CD Rotate [Quay || Dừng] (Dùng animate gồm 2 đối số truyền vào là mảng và object)
        //<Link Animate: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate>
        const cdThumbAnimate = cdThumb.animate ([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity  //Quay vô hạn
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            // console.log(newCdWidth);
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            
            //opacity chỉ định độ mờ và độ trong suốt của 1 phần tử có giá trị từ 0 - 1
            cd.style.opacity = newCdWidth / cdWidth;
        }       

        //(Chỉ var vs let mới có thể gán lại biến còn const thì ko thể gán lại biến = true được)
        var isPlaying = false;
        playBtn.onclick = function () {
            if(isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        
        //Khi song được play
        audio.onplay = function () {
            isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi song bị pause
        audio.onpause = function () {
            isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi thì thanh progress cũng phải trượt theo
        //(HTML audo/video W3School)
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua (seek)
        progress.onchange = function (element) {
            //Lấy được % và từ % lấy ngược ra (s) thời gian hiện tại
            const seekTime = (element.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }

        //Xử lý khi next song
        nextBtn.onclick = function () {
            //Logic: Khi ấn nút random => class ('active') = true 
            //thì lúc này ấn vào nút next thì sẽ random các bài hát
            if (randomBtn.classList.contains('active')) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            //8.Active Song
            app.render();
            //9. Scroll active song into view 
            app.scrollToActiveSong();
        }

        //Xử lý khi prev song
        prevBtn.onclick = function () {
            //Logic: Khi ấn nút random => class ('active') = true 
            //thì lúc này ấn vào nút prev thì sẽ random các bài hát
            if(randomBtn.classList.contains('active')) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            //8.Active Song
            app.render();
            //9. Scroll active song into view 
            app.scrollToActiveSong();
        }

        //6. Xử lý bật/tắt nút random
        randomBtn.onclick = function () {
            randomBtn.classList.toggle('active');
        }

        //7. Xử lý phát lại 1 bài hát(repeat)
        repeatBtn.onclick = function () {
            repeatBtn.classList.toggle('active');
        }

        //7. Xử lý next song khi audio ended (HTML audo/video W3School)
        audio.onended = function () {
            if(repeatBtn.classList.contains('active')) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }   

        //10. Play song when click
        playList.onclick = function (element) {
            const songNode = element.target.closest('.song:not(.active)');
            if(songNode || element.target.closest('.option')) {
                //Xử lý khi click vào song
                if(songNode){
                    console.log(songNode.getAttribute('data-index'));
                    app.currentIndex = Number(songNode.getAttribute('data-index'));
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }

                //Xử lý khi click vào song option
                if(element.target.closest('.option')) {

                }
            }
        }

    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    playRandomSong: function () {
        // Luôn chạy bài hát random và chỉ dừng khi bài hát đó trùng với bài hiện tại đang mở
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex;
        app.loadCurrentSong();
        //check trong console log
        console.log(newIndex);
    },

    scrollToActiveSong: function () {
        //scroll into view Javascript (Mozilla)
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 300);
    },

    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe / Xử lý các sự kiện (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UserInterface khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();
    }
};

app.start();




























































