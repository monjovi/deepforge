/* globals browser */
describe('Operations', function() {
    const PROJECT_NAME = `OperationTests${Date.now()}`;

    const testFixture = require('../../globals');
    const gmeConfig = testFixture.getGmeConfig();
    const utils = require('../utils');
    const URL = utils.getUrl(PROJECT_NAME);
    const logger = testFixture.logger.fork('ExecuteJob');
    //const Operation = require('../../../src/common/OperationCode');
    const assert = require('assert');

    //const assert = require('assert');
    const S = require('../selectors');
    let storage;
    let gmeAuth;
    let project;
    let commitHash;

    this.timeout(10000);
    before(function(done) {
        testFixture.clearDBAndGetGMEAuth(gmeConfig, PROJECT_NAME)
            .then(function (gmeAuth_) {
                gmeAuth = gmeAuth_;
                // This uses in memory storage. Use testFixture.getMongoStorage to persist test to database.
                storage = testFixture.getMongoStorage(logger, gmeConfig, gmeAuth);
                return storage.openDatabase();
            })
            .then(function () {
                var importParam = {
                    projectSeed: testFixture.path.join(testFixture.DF_SEED_DIR, 'tests', 'tests.webgmex'),
                    projectName: PROJECT_NAME,
                    branchName: 'master',
                    logger: logger,
                    gmeConfig: gmeConfig
                };

                return testFixture.importProject(storage, importParam);
            })
            .then(function (importResult) {
                project = importResult.project;
                commitHash = importResult.commitHash;
                return project.createBranch('test', commitHash);
            })
            .nodeify(done);

        // TODO: create the seed projects
        // TODO: 
        // Create a new project
        // TODO

    });

    after(function(done) {
        // TODO: remove the project
        storage.closeDatabase()
            .then(function () {
                return gmeAuth.unload();
            })
            .nodeify(done);
    });

    describe.skip('creation', function() {
        let url = utils.getUrl(PROJECT_NAME, '/f/G');
        //beforeEach(function() {  // open the project
            //let projectBtn = '.project-list .open-link';
            //browser.url(URL);
            //browser.waitForVisible(projectBtn, 5000);
            //browser.click(projectBtn);
        //});

        it('should be able to create a new operation', function() {
            browser.url(URL);
            browser.waitForVisible('#pluginBtn', 10000);
            browser.click('#pluginBtn');
            browser.waitForVisible('.pipeline-editor', 1000);
        });
    });

    describe('editing', function() {
        let url = utils.getUrl(PROJECT_NAME, '/k/8', 'test');

        describe('interface editor', function() {
            beforeEach(function(done) {
                project.getBranchHash('test')
                    .then(commitHash => project.deleteBranch('test', commitHash))
                    .then(() => project.createBranch('test', commitHash))
                    .then(() => browser.url(url))
                    .nodeify(done);
            });

            it('should add input to interface', function() {
                browser.waitForVisible(S.INT.OPERATION, 10000);
                browser.leftClick(S.INT.OPERATION);
                browser.waitForVisible(S.INT.ADD_INPUT, 10000);
                browser.leftClick(S.INT.ADD_INPUT);
                browser.waitForVisible(S.INT.INPUT, 2000);
                // check the code value
                let code = browser.execute(function() {
                    var ace = requirejs('ace/ace');
                    var editor = ace.edit($('.ace_editor')[0]);
                    
                    return editor.getSession().getValue();
                }).value;

                // FIXME: it would be ideal to use the same operation parser
                // rather than regex checking
                //
                //let operation = new Operation(code);
                //let inputs = operation.getInputs();
                //assert.equal(inputs.length, 1);
                let execArgCount = code.match(/execute.*?:/)[0]
                    .split('(')[1]
                    .split(')')[0]
                    .split(',').length;
                assert.equal(execArgCount, 2);  // self, data
            });

            it('should update code on add input', function() {
            });

            it('should update code on add output', function() {
            });
        });

        describe.skip('code editor', function() {
            beforeEach(function(done) {
                project.getBranchHash('test')
                    .then(commitHash => project.deleteBranch('test', commitHash))
                    .then(() => project.createBranch('test', commitHash))
                    .then(() => {
                        browser.url(url);
                        browser.waitForVisible('.operation-interface-editor', 2000);
                    })
                    .nodeify(done);
            });

            // TODO: create a new branch for each?
            // Should I create all the branches at the beginning or import a new project each time?
            it('should add input to model', function() {
                browser.execute()
                // TODO: add input to 'execute' method
                // TODO: check that it shows in the interface editor
            });

            it('should add attribute to operation', function() {
                // TODO: check that it shows in the interface editor
            });
        });
    });

    describe.skip('basic operations', function() {
        //beforeEach(function() {  // open the project
            //let projectBtn = '.project-list .open-link';
            //browser.url(URL);
            //browser.waitForVisible(projectBtn, 10000);
            //browser.click(projectBtn);
        //});

        it('should create project', function(done) {
            this.timeout(100000);
            browser.url(URL);
            browser.waitForVisible('.btn-create-new', 10000);
            setTimeout(done, 5000);
            //browser.click('.btn-create-new');
            //browser.setValue('.txt-project-name', PROJECT_NAME);
            //browser.click('.btn-save');
            //browser.waitForVisible('.btn-create-snap-shot', 10000);
            //browser.click('.btn-create-snap-shot');
            //browser.waitForVisible('.background-text', 10000);
        });
    });

    //describe('visual-textual sync', function() {
        //before(function() {
            //// Create the operation
            //browser.click(S.ACTION_BTN);
            //browser.click(S.ACTION_BTN);
            //browser.waitForEnabled(S.NEW_OPERATION, 10000);
            //browser.click(S.NEW_OPERATION);
            //browser.waitForEnabled(S.INT.OPERATION, 10000);
        //});

        //it('should add textual input on adding visual input', function() {
            //browser.click(S.INT.OPERATION);
            //// TODO: add textual input
        //});
    //});
});
