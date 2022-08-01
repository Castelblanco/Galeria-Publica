"use strict";
$(()=>{
    let inputSearch = $(".input_search"),
        btnSearch = $(".btn_search"),
        btnPublic = $(".btn_public"),
        trayImg = $(".images"),
        btnX = $(".btn_X"),
        imgFile = $(".res_icon"),
        fileRes = $(".img_file_res"),
        infoRes = $(".res_info"),
        loadImg = $(".load_img"),
        loadFile = $(".load_file"),
        windowPublic = $(".public"),
        miniImg = $(".ico_file"),
        inputFile = $(".img"),
        wordKey = $(".wordKey"),
        formImg = $(".formImg"),
        btnFetch = $(".btn_fetch"),
        img = $(".images"),
        boxObserver = $(".observer"),
        imgZoom = $(".img_zoom"),
        imgZoomDiv = $(".img_img"),
        imgZoomImg = $(".img_img img"),
        btnZoomX = $(".btn_controll_X"),
        btnZoomIn = $(".btnC_z_in"),
        btnZoomOut = $(".btnC_z_out"),
        page = 0,
        api = "https://api-galeria-production.up.railway.app",
        changeUrl = true,
        scroll = true,
        observer = new IntersectionObserver(entries =>{
            if (entries[0].isIntersecting && scroll){
                if (changeUrl) findImg(`${api}?page=${page++}&size=20`);
                else findImg(`${api}?page=${page++}&size=20&wordKey=${inputSearch.val()}`);
            }
        }, {rootMargin: "0px 0px 10px 0px"});

    observer.observe(boxObserver[0]);
    const findImg = url =>{
        loadImg.show();
        $.ajax({
            url: url,
            success: (res)=>{
                loadImg.hide();
                if (res.img.length !== 0){
                    res.img.forEach(i => {
                        trayImg.append($("<img/>", {
                            "src": `data:${i.type};base64,${i.img}`,
                            "alt": "image",
                            "class": "imgVisible"
                        }));
                    });
                }else scroll = false;
            },
            error: (error)=> console.log(error.responseJSON)
        });
    }

    const hideWindow = div => div.toggle(700);

    function hideWindowPublic() {
        hideWindow(windowPublic);
        fileRes.hide();
        miniImg.show();
        btnFetch.hide();
        wordKey.hide();
        miniImg.attr("src", "./img/icono.png").css({ width: "20%" });
        wordKey.val("");
        wordKey.val("");
    }

    function resPostImg(img, res, color) {
        loadFile.hide(500);
        fileRes.toggle(500);
        imgFile.attr("src", img).css({ background: color });
        infoRes.text(res);
    }

    const minMaxImg = inOrOut =>{
        if (inOrOut === "min")imgZoomDiv.css({ width: "-=150px" })
        else imgZoomDiv.css({ width: "+=150px" });
    }

    inputSearch.keyup(e =>{
        if (e.target.value != ""){
            btnSearch.removeClass("inactive").addClass("active");
        }
        else btnSearch.removeClass("active").addClass("inactive");
    })

    btnSearch.click(e =>{
        if (e.target.classList[1] === "active"){
            page = 0;
            changeUrl = false;
            scroll = true;
            trayImg.children().remove();
            findImg(`${api}?page=${page++}&size=10&wordKey=${inputSearch.val()}`);
        }
    });

    btnPublic.click(()=> hideWindow(windowPublic));
    btnX.click(()=> hideWindowPublic());

    inputFile.change(e =>{
        btnFetch.show();
        wordKey.show();
        fileRes.hide(500);
        miniImg.show(500);
        let img = e.target.files[0];
        let url = URL.createObjectURL(img);
        miniImg.attr("src", url).css({ width: "100%" });

    })

    formImg.submit(e =>{
        e.preventDefault();

        if (wordKey.val() === "") alert("Se necesita que la imagen tenga una palabra clave para que otras personas puedan encontrarla.");
        else{
            miniImg.hide(500);
            loadFile.show(500);
            let dataImg = new FormData(formImg[0]);
            $.ajax({
                type: "post",
                url: `${api}upload.img`,
                data: dataImg,
                processData: false,
                contentType: false,
                success: (res)=>{
                    resPostImg("./img/check.svg", "Publicación Exitosa", "#0f0");
                    setTimeout(()=> hideWindowPublic(), 4000);
                },
                error: ()=>{
                    resPostImg("./img/x.svg", "Publicación Fallida", "#f00");
                    setTimeout(()=> hideWindowPublic(), 4000);
                }
            });
        }
    })

    img.click(e=>{
        if (e.target.src){
            hideWindow(imgZoom);
            imgZoomImg.attr("src", e.target.src);
        }
    });

    btnZoomX.click(()=>{
        hideWindow(imgZoom);
        imgZoomDiv.css({ width: "80%" });
    });

    btnZoomIn.click(()=> minMaxImg());
    btnZoomOut.click(()=> minMaxImg("min"));
})