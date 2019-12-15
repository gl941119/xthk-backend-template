<template>
    <div class='no-apps'>
        <div class='no-app-info-wrap'>
            <div class='no-app-info-inner'>
                <div class='no-app-info'>
                    <span class='app-info'>暂无可用应用</span>
                    <sub>请联系人事开通权限</sub>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.no-apps {
    position: absolute;
    width: 1200px;
    height: $p100;
    left: 50%;
    transform: translateX(-50%);
    background-color: $white;
    background-image: url('../../../assets/images/no-apps.png');
    background-repeat: no-repeat;
    background-position: 19.5% center;
    .no-app-info-wrap {
        position: absolute;
        width: 240px;
        height: 335px;
        left: 50.58%;
        top: 50%;
        transform: translateY(-50%);
        user-select: none;
        .no-app-info-inner {
            display: table;
            width: $p100;
            height: $p100;
            .no-app-info {
                display: table-cell;
                vertical-align: middle;
                .app-info {
                    font-size: 40px;
                    color: rgba(67, 78, 89, 1);
                }
                sub {
                    font-size: 20px;
                }
            }
        }
    }
}
</style>
