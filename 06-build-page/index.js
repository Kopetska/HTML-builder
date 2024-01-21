const fs = require('fs');
const path = require('path');

fs.rm(
  path.join(__dirname, 'project-dist'),
  { force: true, recursive: true },
  () => {
    fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
      fs.readdir(
        path.join(__dirname, 'components'),
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            throw err;
          } else {
            let searchArray = [];
            files.forEach((element) => {
              searchArray.push(
                element.name.slice(
                  0,
                  element.name.length - path.extname(element.name).length,
                ),
              );
            });
            let template = '';
            const reading = fs.createReadStream(
              path.join(__dirname, 'template.html'),
              'utf-8',
            );
            reading.on('data', (input) => {
              template = input.toString();
              searchArray.forEach((element) => {
                const component = fs.createReadStream(
                  path.join(__dirname, 'components', element + '.html'),
                  'utf-8',
                );
                component.on('data', (componentData) => {
                  template = template.replace(
                    '{{' + element + '}}',
                    componentData.toString(),
                  );
                  const inputFile = fs.createWriteStream(
                    path.join(__dirname, 'project-dist', 'index.html'),
                    'utf-8',
                  );
                  inputFile.write(template);
                });
              });
            });
          }
        },
      );
    });
  },
);

function mergeStyles() {
  fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), () => {});
  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        throw err;
      } else {
        files.forEach((element) => {
          if (
            element.isFile() &&
            path
              .extname(element.name)
              .slice(1, path.extname(element.name).length) === 'css'
          ) {
            const reading = fs.createReadStream(
              path.join(__dirname, 'styles', element.name),
              'utf-8',
            );
            reading.on('data', (input) => {
              fs.appendFile(
                path.join(__dirname, 'project-dist', 'style.css'),
                input.toString(),
                () => {},
              );
            });
          }
        });
      }
    },
  );
}

mergeStyles();

function copyDir(source, destination) {
  fs.rm(destination, { force: true, recursive: true }, () => {
    fs.mkdir(destination, { recursive: true }, (error) => {
      if (error) {
        throw error;
      } else {
        fs.readdir(source, { withFileTypes: true }, (err, files) => {
          if (err) {
            throw err;
          } else {
            files.forEach((element) => {
              if (!element.isFile()) {
                copyDir(
                  path.join(source, element.name),
                  path.join(destination, element.name),
                );
              }
              fs.copyFile(
                path.join(source, element.name),
                path.join(destination, element.name),
                () => {},
              );
            });
          }
        });
      }
    });
  });
}

copyDir(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
);
