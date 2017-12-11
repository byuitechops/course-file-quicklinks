/*eslint-env node, es6*/
/*eslint no-unused-vars:0*/
/*eslint no-undef:0*/
/*eslint no-console:0*/

/* Replace quicklinks found in course files post conversion */
const async = require('async'),
    canvas = require('canvas-wrapper'),
    cheerio = require('cheerio');

module.exports = (course, stepCallback) => {
    course.addModuleReport('course-file-quicklinks');
    //A. Find all course file quicklinks
    var courseId = course.info.canvasOU,
        url = '/api/v1/courses/' + courseId + '/files',
        $;

    function toHrefCheerio(htmlPage) {
        //console.log('HTML PAGE', htmlPage);
        //return htmlPage.attr('href')
    }

    function toInternalHrefs(link) {
        return link.includes('/content/enforced')
    }

    function toQuicklink(link) {
        return link.includes('quicklink')
    }

    //get all html files
    function getAllHtmlFiles(url, courseId, callback) {
        canvas.get(url, function (err, files) {
            if (err) {
                console.log('ERROR', err)
            }
            course.success('course-file-quicklinks', 'successfully retrieved course files');
            callback(err, files);
        });
    }

    function getAllHtml(htmlFiles) {
        //read htmls of course files
        //console.log('getallHtml receiving:', htmlFiles)
        var filteredHtmlFiles = htmlFiles
            .map(function (file) {
                //file obj doesn't have a dom.
                return file.dom;
            });
        //console.log('getAllHtml returns:', filteredHtmlFiles)
        course.success('course-file-quicklinks', 'successfully filtered htmlFiles');
        return filteredHtmlFiles;
    }

    function filterHrefs(filteredHtmlFiles) {
        //get hrefs, filter them
        var quicklinks = filteredHtmlFiles.forEach(function (file) {
            //how to get all the html files separately and THEN map them?? attempt...
            //console.log('IM PASSING', filteredHtmlFiles)
            var getQuicklinks = filteredHtmlFiles
                .map(toHrefCheerio)
                .filter(toInternalHrefs)
                .filter(toQuicklink);
            course.success('course-file-quicklinks', 'successfully found all quicklinks');
            return getQuicklinks;
        });
        return quicklinks;
    }

    function getQuicklinkHrefs(url, courseId) {
        getAllHtmlFiles(url, courseId, function (err, files) {
            var allHtmlFiles = files,
                filteredHtmlFiles = getAllHtml(allHtmlFiles),
                allQuicklinks = filterHrefs(filteredHtmlFiles);
            //return allQuicklinks;
        });
    }
    getQuicklinkHrefs(url, courseId);
    /*B. Build the newURL with the id*/
    /*async.each(getQuicklinkHrefs(url, courseId), function (file, callback) {
        //replace quicklink href with newUrl
        var newURL = 'https://instructure.com/courses/$' + courseId + '/files/$' + file.id + '/download?wrap=1';
        var newFileURL = newURL;
        canvas.put(url, file, function (err, body) {
            if (err) {
                console.log(err)
            }
            file.id = file.id;
            console.log("id", file.id);
            file.url == newFileURL;
        });
        course.success('course-file-quicklinks', 'successfully rebuilt quicklink url');
    });
    stepCallback(null, course);*/
};
