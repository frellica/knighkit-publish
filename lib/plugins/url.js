var path = require('path');
var shell = require('shelljs');
var utils = require('./../utils');
require("consoleplusplus");
console.disableTimestamp();
var cped = {};

exports.reg = utils.regs['url'];

exports.reset = function () {
    cped = {};
};

/**
 *
 * @param m ƥ�䵽���ַ���
 * @param htmlpath htmlҳ���·��
 * @param projectRoot ��Ŀԭ·��
 * @param pageName htmlҳ�������
 * @param baseurl �ϴ���cms�󣬹̶���serverǰ׺
 * @param publishroot ��Ŀ�������·��
 */
exports.replace = function (m, htmlpath, projectRoot, pageName, baseurl, publishroot) {
    var cwd = process.cwd();
    var urlStat = m.match(/(url)\((['"]?)([^'"#\)]+(?:#?)(.*))\2\)\s*/);
    if (urlStat === null) {
        return m;
    }
    var imgUrl = urlStat[3];
    if (imgUrl.indexOf('http') === 0 ||//���ϵ���Դ��ֱ�ӷ��أ�������
        imgUrl === '') {//�յ�ͼƬ��ַ������
        return m;
    }
    var imgSrc = path.resolve(path.dirname(htmlpath), imgUrl.replace(/\?.*/, ''));//����ͼƬ����� ?xxx�����
    if (/^\/|^\\/.test(imgUrl)) { //�� / ��ͷ��·����ָ����Ŀ�ĸ�·������Ӧָ���̷��ĸ�
        imgSrc = path.resolve(cwd, '.' + imgUrl);
    }
    shell.cp('-rf', imgSrc, publishroot + '/statics');//������Ŀ��Ŀ¼
    if (!cped[imgSrc]) {
        cped[imgSrc] = true;
        console.info('#green{[copy file]} ' + imgUrl.replace(/\?.*/, '') + ' #green{[to /statics.]}\n');
    }
    var md5name = utils.md5file(path.resolve(publishroot + '/statics', path.basename(imgSrc)));//��Ŀ��Ŀ¼����Դ������md5����
    return m.replace(imgUrl, (baseurl || '.') + '/statics/' + md5name);
};