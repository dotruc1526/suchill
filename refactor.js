const fs = require('fs');
const path = require('path');

const apiPath = path.join('lib', 'api.ts');
let apiContent = fs.readFileSync(apiPath, 'utf8');
apiContent = apiContent.replace('192.168.1.100', '10.241.8.245');
fs.writeFileSync(apiPath, apiContent);

fs.mkdirSync('components', { recursive: true });
fs.writeFileSync('components/Box.tsx', `import { createBox } from '@shopify/restyle';\nimport { Theme } from '../theme';\nexport const Box = createBox<Theme>();\n`);
fs.writeFileSync('components/Text.tsx', `import { createText } from '@shopify/restyle';\nimport { Theme } from '../theme';\nexport const Text = createText<Theme>();\n`);

const screens = [
  'app/login.tsx',
  'app/(tabs)/index.tsx',
  'app/(tabs)/more.tsx',
  'app/settings.tsx',
  'app/about.tsx'
];

screens.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const compPath = file.includes('(tabs)') ? '../../components' : '../components';
  
  content = content.replace(/import\s*{\s*View,\s*Text(?:,\s*Button)?\s*}\s*from\s*'react-native';/, (match) => {
      return match.includes('Button') 
          ? `import { Button } from 'react-native';\nimport { Box } from '${compPath}/Box';\nimport { Text } from '${compPath}/Text';`
          : `import { Box } from '${compPath}/Box';\nimport { Text } from '${compPath}/Text';`;
  });
  
  content = content.replace(/<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>/g, '<Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">');
  content = content.replace(/<\/View>/g, '</Box>');
  content = content.replace(/<View style={{ height: 10 }} \/>/g, '<Box height={10} />');
  content = content.replace(/<Text style={{ fontSize: 24, marginBottom: 20 }}>/g, '<Text variant="header" marginBottom="lg">');

  fs.writeFileSync(file, content);
});
