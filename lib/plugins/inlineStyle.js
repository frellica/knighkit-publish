var path = require('path');
var shell = require('shelljs');
var utils = require('./../utils');
require("consoleplusplus");
console.disableTimestamp();
var cped = {};

exports.reg = /<(img)\s+[\s\S]*?["'\s\w\/]>\s*/ig;

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
    var imgPath = htmlpath;
    var cwd = process.cwd();
    var htmlName = htmlpath.replace(path.join(cwd, 'pages/'), '').replace(cwd, '');
    if (baseurl === '.') {
        baseurl = path.relative(path.dirname(projectRoot + '/' + htmlName), projectRoot);
    }

    var getSrc = m.match(/(?:\ssrc\s*=\s*)(['"]?)([^'"\s]*)\1/);
    if (getSrc[2].indexOf('http') === 0 ||//���ϵ���Դ��ֱ�ӷ��أ�������
        getSrc[2] === '') {//�յ�ͼƬ��ַ������
        return m;
    }

    var imgSrc = path.resolve(path.dirname(imgPath), getSrc[2].replace(/\?.*/, ''));//����ͼƬ����� ?xxx�����
    if (/^\/|^\\/.test(getSrc[2])) { //�� / ��ͷ��·����ָ����Ŀ�ĸ�·������Ӧָ���̷��ĸ�
        imgSrc = path.resolve(cwd, '.' +getSrc[2]);
    }
    shell.cp('-rf', imgSrc, publishroot + '/statics');//������Ŀ��Ŀ¼

    if (!cped[imgSrc]) {
        cped[imgSrc] = true;
        console.info('#green{[copy file]} ' + getSrc[2].replace(/\?.*/, '') + ' #green{[to /statics.]}\n');
    }

    var md5name = utils.md5file(path.resolve(publishroot + '/statics', path.basename(imgSrc)));//��Ŀ��Ŀ¼����Դ������md5����
    return m.replace(getSrc[2], (baseurl || '.') + '/statics/' + md5name);
};