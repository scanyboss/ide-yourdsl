const {AutoLanguageClient} = require('atom-languageclient');
const cp = require('child_process');
const path = require('path');

class YourDSLLanguageClient extends AutoLanguageClient {
    getGrammarScopes() {
        return ['source.yourdsl']
    }

    getLanguageName() {
        return 'YourDSL'
    }

    getServerName() {
        return 'YourDsl'
    }

    startServerProcess(projectPath) {
        const serverHome = path.join(__dirname, 'server');
        const args = [];
        args.push(
            '-jar', path.join(serverHome,'org.example.yourdsl.ide-1.0.0-SNAPSHOT-ls.jar')
        );
        console.log(args);
        console.log(serverHome);
        const childProcess = cp.spawn('java', args,{ cwd: serverHome });
        this.captureServerErrors(childProcess);
        childProcess.on('close', exitCode => {
            if (!childProcess.killed) {
                atom.notifications.addError('IDE-YourDSL language server stopped unexpectedly.', {
                    dismissable: true,
                    description: this.processStdErr ? `<code>${this.processStdErr}</code>` : `Exit code ${exitCode}`
                })
            }
        });
        return childProcess;
    }
}

module.exports = new YourDSLLanguageClient();
