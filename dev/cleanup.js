import { readdirSync, rmdirSync } from 'fs';
import chalk from 'chalk';
import { repo } from './developer';
const { cwd, chdir } = process;

// -------------------------------------------------------------------------------------------------
// TODO 1 (after CLI upgrade): Configure cleanup to run using node-mongo command i.e. "node-mongo cleanup" not "npm run cleanup"
// TODO 2 (if possible): (I don't think you will need this TODO when this is done using the "node-mongo cleanup" command - or it might need slight modification)
          // update package.json cleanup script dynamically with the cleanup file path.
          // This means you will have to get the cleanup file name/path dynamically too...
// Or... (instead) should cleanup script be handled a pre-commit hook or pre-push hook or something? - We'll see...
// -------------------------------------------------------------------------------------------------

// cd into repo root
chdir('../');

// use repo root
const rootDir = cwd();

// return all files and folders in repo root i.e. original + node-mongo generated
 const repoContent = readdirSync(rootDir, (err, filesAndFolders) => {
    if (err) {
      throw err;
    }

    return filesAndFolders;
});

const filterContentToGetTheOnesGeneratedByCLI = repoContent.reduce((acc, curr) => {
  if (!repo.originalContentList.includes(curr)) {
    acc.push(curr);
  }
  return acc;
}, []);

// delete folders generated by CLI
if (filterContentToGetTheOnesGeneratedByCLI.length) {
  try {
    filterContentToGetTheOnesGeneratedByCLI.map(folder => {
      console.log(chalk.green(`✔ ${folder} folder deleted successfully`));
      return rmdirSync(folder, { recursive: true, force: true });
    });
    console.log('');
  } catch (err) {
    console.log(chalk.red(err));
  }
} else {
  console.log(chalk.yellowBright('ℹ There are no folders to delete yet. Generate folder(s) using the "node-mongo" command, then run the cleanup script after you are done developing, and are ready to add and push your changes/fixes.\n'));
}

// ------------------------------------
// TODO: Write another script at the end of this file
// that updates this repoContent list back when done.
// Is this TODO even needed? - We'll see. For now the
// solution ending here works fine.
// ------------------------------------
