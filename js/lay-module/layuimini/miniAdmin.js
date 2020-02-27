/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 框架扩展
 */
layui.define(["element", "jquery", "miniMenu"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer,
        miniMenu = layui.miniMenu;

    if (!/http(s*):\/\//.test(location.href)) {
        var tips = "请先将项目部署至web容器（Apache/Tomcat/Nginx/IIS/等），否则部分数据将无法显示";
        return layer.alert(tips);
    }

    var miniAdmin = {

        /**
         * 后台框架初始化
         * @param options.iniUrl   后台初始化接口地址
         * @param options.clearUrl   后台清理缓存接口
         * @param options.urlHashLocation URL地址hash定位
         * @param options.urlSuffixDefault URL后缀
         * @param options.BgColorDefault 默认皮肤
         * @param options.checkUrlDefault 是否判断URL有效
         * @param options.multiModule 是否开启多模块
         */
        render: function (options) {

            options.iniUrl = options.iniUrl || null;  // 后台初始化接口地址
            options.clearUrl = options.clearUrl || null;  // 后台清理缓存接口
            options.urlHashLocation = options.urlHashLocation || false;  // URL地址hash定位
            options.urlSuffixDefault = options.urlSuffixDefault || false;    // URL后缀
            options.BgColorDefault = options.BgColorDefault || 0;   // 默认皮肤（0开始）
            options.checkUrlDefault = options.checkUrlDefault || false; // 是否判断URL有效
            options.multiModule = options.multiModule || false;  // 是否开启多模块

            console.log(options);

            var loading = layer.load(0, {shade: false, time: 2 * 1000});
            $.getJSON(options.iniUrl, function (data, status) {
                if (data == null) {
                    miniAdmin.error('暂无菜单信息')
                } else {
                    // 初始化菜单
                    miniMenu.render({menuList: data.menuInfo, multiModule: options.multiModule});
                    // 初始化LOGO
                    miniAdmin.renderLogo(data.logoInfo);
                }
            }).fail(function () {
                miniAdmin.error('菜单接口有误');
            });
            layer.close(loading)

        },

        renderLogo: function (data) {
            var html = '<a href="' + data.href + '"><img src="' + data.image + '" alt="logo"><h1>' + data.title + '</h1></a>';
            $('.layuimini-logo').html(html);
        },

        /**
         * 成功
         * @param title
         * @returns {*}
         */
        success: function (title) {
            return layer.msg(title, {icon: 1, shade: this.shade, scrollbar: false, time: 2000, shadeClose: true});
        },

        /**
         * 失败
         * @param title
         * @returns {*}
         */
        error: function (title) {
            return layer.msg(title, {icon: 2, shade: this.shade, scrollbar: false, time: 3000, shadeClose: true});
        },

        getBgColorConfig: function (bgcolorId) {
            var bgColorConfig = [
                {
                    headerRight: '#1aa094',
                    headerRightThis: '#197971',
                    headerLogo: '#243346',
                    menuLeft: '#2f4056',
                    menuLeftThis: '#1aa094',
                    menuLeftHover: '#3b3f4b',
                },
                {
                    headerRight: '#23262e',
                    headerRightThis: '#0c0c0c',
                    headerLogo: '#0c0c0c',
                    menuLeft: '#23262e',
                    menuLeftThis: '#1aa094',
                    menuLeftHover: '#3b3f4b',
                }
            ];

            if (bgcolorId == undefined) {
                return bgColorConfig;
            } else {
                return bgColorConfig[bgcolorId];
            }
        }

    };





    /**
     * 左侧菜单的切换
     */
    $('body').on('click', '[data-menu]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var $parent = $(this).parent();
        var menuId = $(this).attr('data-menu');
        // header
        $(".layuimini-header-menu .layui-nav-item.layui-this").removeClass('layui-this');
        $(this).addClass('layui-this');
        // left
        $(".layuimini-menu-left .layui-nav.layui-nav-tree.layui-this").addClass('layui-hide');
        $(".layuimini-menu-left .layui-nav.layui-nav-tree.layui-this.layui-hide").removeClass('layui-this');
        $("#" + menuId).removeClass('layui-hide');
        $("#" + menuId).addClass('layui-this');
        layer.close(loading);
    });

    /**
     * 清理
     */
    $('body').on('click', '[data-clear]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        sessionStorage.clear();

        // 判断是否清理服务端
        var clearUrl = $(this).attr('data-href');
        if (clearUrl != undefined && clearUrl != '' && clearUrl != null) {
            $.getJSON(clearUrl, function (data, status) {
                layer.close(loading);
                if (data.code != 1) {
                    return miniAdmin.error(data.msg);
                } else {
                    return miniAdmin.success(data.msg);
                }
            }).fail(function () {
                layer.close(loading);
                return miniAdmin.error('清理缓存接口有误');
            });
        } else {
            layer.close(loading);
            return miniAdmin.success('清除缓存成功');
        }
    });

    /**
     * 刷新
     */
    $('body').on('click', '[data-refresh]', function () {
        $(".layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload();
        miniAdmin.success('刷新成功');
    });

    /**
     * 菜单栏缩放
     */
    $('body').on('click', '[data-side-fold]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var isShow = $(this).attr('data-side-fold');
        if (isShow == 1) { // 缩放
            $(this).attr('data-side-fold', 0);
            $('.layuimini-tool i').attr('class', 'fa fa-indent');
            $('.layui-layout-body').attr('class', 'layui-layout-body layuimini-mini');
        } else { // 正常
            $(this).attr('data-side-fold', 1);
            $('.layuimini-tool i').attr('class', 'fa fa-outdent');
            $('.layui-layout-body').attr('class', 'layui-layout-body layuimini-all');
        }
        // layuimini.tabRoll();
        element.init();
        layer.close(loading);
    });

    /**
     * 监听提示信息
     */
    $("body").on("mouseenter", ".layui-menu-tips", function () {
        var classInfo = $(this).attr('class'),
            tips = $(this).children('span').text(),
            isShow = $('.layuimini-tool i').attr('data-side-fold');
        if (isShow == 0) {
            openTips = layer.tips(tips, $(this), {tips: [2, '#2f4056'], time: 30000});
        }
    });
    $("body").on("mouseleave", ".layui-menu-tips", function () {
        var isShow = $('.layuimini-tool i').attr('data-side-fold');
        if (isShow == 0) {
            try {
                layer.close(openTips);
            } catch (e) {
                console.log(e.message);
            }
        }
    });

    /**
     * 弹出配色方案
     */
    $('body').on('click', '[data-bgcolor]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        var clientHeight = (document.documentElement.clientHeight) - 95;
        var bgColorHtml = miniAdmin.buildBgColorHtml();
        var html = '<div class="layuimini-color">\n' +
            '<div class="color-title">\n' +
            '<span>配色方案</span>\n' +
            '</div>\n' +
            '<div class="color-content">\n' +
            '<ul>\n' + bgColorHtml + '</ul>\n' +
            '</div>\n' +
            '</div>';
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shade: 0.2,
            anim: 2,
            shadeClose: true,
            id: 'layuiminiBgColor',
            area: ['340px', clientHeight + 'px'],
            offset: 'rb',
            content: html,
            end: function () {
                $('.layuimini-select-bgcolor').removeClass('layui-this');
            }
        });
        layer.close(loading);
    });

    /**
     * 选择配色方案
     */
    $('body').on('click', '[data-select-bgcolor]', function () {
        var bgcolorId = $(this).attr('data-select-bgcolor');
        $('.layuimini-color .color-content ul .layui-this').attr('class', '');
        $(this).attr('class', 'layui-this');
        sessionStorage.setItem('layuiminiBgcolorId', bgcolorId);
        layuimini.initBgColor();
    });

    /**
     * 全屏
     */
    $('body').on('click', '[data-check-screen]', function () {
        var check = $(this).attr('data-check-screen');
        if (check == 'full') {
            layuimini.fullScreen();
            $(this).attr('data-check-screen', 'exit');
            $(this).html('<i class="fa fa-compress"></i>');
        } else {
            layuimini.exitFullScreen();
            $(this).attr('data-check-screen', 'full');
            $(this).html('<i class="fa fa-arrows-alt"></i>');
        }
    });


    exports("miniAdmin", miniAdmin);
});