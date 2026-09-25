import { useState, useEffect } from 'react':import { api } from './services/apiV2';

export default function AppV2() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('login');
  
  // Auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Learning state
  const [events, setEvents] = useState([0y);
  const [selectedLesson, setSelectedLesso�] = useState<any>(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [lastXp, setLastXp] = useState(0);
  const [progress, setProgress] = useState<number[]>([]);

  const handleLogin = async () => {
    try {
      const u = await api.login(username, password);
      if(u.error) return setAuthError(u.error);
      setUser(u);
      ladData(u.id);
    } catch(e) { setAuthError('Lôi kret noi'); }
  };

  const handleRegister = async () => {
    try {
      const u = await api.register(username, password);
      if(u.error) return setAuthError(u.error);
      setUser(u);
      ladData(u.id);
    } catch(e) { setAuthError('Lôi kết nối'); }
  };

  const ladData = (uid: number) => {
    api.getLessons().then(data => setEvents(data));
    api.getProgress(uid).then(data => setProgress(data));
    setView('home');
  };

  if(view === 'login') {
    return (
      <div className='p-4 max-w-md mx-auto bg-amber-50 min-h-screen text-amber-950 font-sans flex flex-col justify-center'>
        <h1 className='text-4xl font-bold mb-8 text-red-800 text-center'>Sử Chill</h1>
        <div className='bg-white p-6 rounded-lg shadow-mb'>
          <h2 className='text-xl font-bold mb-4'>Đā9�������(������������ѡ�ɽȀ�����������9�����ѕ�еɕ���������Ĝ���ѡ�ɽ������(�������������Ёم�Ք���͕ɹ���􁽹������픀���͕�U͕ɹ������хɝ�йم�Ք���������������S���G���������������9�����ܵ�ձ����ȁ���́��ɑ�ȁɽչ�������(�������������Ё����������ݽɐ��م�Ք������ݽɑ􁽹������픀���͕�A���ݽɐ���хɝ�йم�Ք���������������7��Ё����Ԝ������9�����ܵ�ձ����ȁ���Ё��ɑ�ȁɽչ�������(�����������؁�����9��������������̜�(���������������ѽ����������������1����􁍱���9���������ā���ɕ������ѕ�еݡ�є���ȁɽչ�����C�����������ѽ��(���������������ѽ�����������������I����ѕ�􁍱���9���������ā�������ȴ����ѕ�еݡ�є���ȁɽչ�����C��������ѽ��(����������𽑥��(��������𽑥��(������𽑥��(������(���((��ɕ��ɸ��(�����؁�����9�������Ё���ܵ����൅�Ѽ��������ȴ���������͍ɕ���ѕ�е����ȴ�������еͅ�́�������(�������؁�����9�������������ѥ�䵉��ݕ����ѕ�̵���ѕȁ���؜�(���������ā�����9�����ѕ�д�ᰁ���е�����ѕ�еɕ�������O��������(���������؁�����9�����ѕ�еɥ��М�(������������������9��������е��������͕ȹ�͕ɹ�������(������������������9�����ѕ�еʹ����W6W"����(	����7G&V���W6W"�7W'&V�E�7G&V�������F�c���F�cࠢ�f�Ws���v���Rrbb���F�c��6�74��S�v�"�Bs�F���N�V2�:�G,:���:l:'����6�>���:.��I�r6�����V2�:�����F�b6�74��S�w76Rג�"s��WfV�G2����Wc�璒����6��7B�4F��R�&�w&W72��6�VFW2�Wb�B���&WGW&����F�b�W�׶Wb�G�6�74��S�G��4F��R�v�6�G��sRr�rw��B&r�v��FR&�V�FVB6�F�r7W'6�"����FW"r��6Ɩ6�҂�����6WE6V�V7FVD�W76��Wb��6WEf�Wr�v�W76��r��ғ��F�b6�74��S�vf�W��W7F�g��&WGvVV�s�ƃ"6�74��S�vf��B�&��BFW�B�&VBӃs�Wb�F�F�W����#���4F��Rbb�7�6�74��S�wFW�B�w&VV��cs�)ɣ��7��Т��F�c��6�74��S�wFW�B�6�FW�B��&W"�ss�Wb�WfV�E���W������F�c����җТ��F�c���F�c��Р��f�Ws���v�W76��rbb6V�V7FVD�W76��bb���F�c�ƃ6�74��S�wFW�B�'��f��B�&��B�"�"FW�B�&VBӃs�6V�V7FVD�W76���F�F�W������F�b6�74��S�w�B&r�v��FR&�V�FVB�"�Bs��6�74��S�wv��FW76R�&R�w&s�6V�V7FVD�W76���6��FV�G������F�c��'WGF��6�74��S�v&r�&VBӃFW�B�v��FR��B��"&�V�FVBr��6Ɩ6�ײ�������vWEVW7F���2�6V�V7FVD�W76���B��F�V�2���6WEVW7F���2�2��6WD7W'&V�E���6WE66�&R���6WEf�Wr�wV��r��ғ����:�V�����'WGF����'WGF��6�74��S�v���BFW�B��&W"Ӄr��6Ɩ6�҂����6WEf�Wr�v���Rr���V������'WGF�����F�c��Р��f�Ws���wV��rbbVW7F���2��V�wF��bb���F�c�ƃ"6�74��S�vf��B�&��B�"�BFW�B�&VBӃs�<:'R�7W'&V�E����VW7F���2��V�wF�����#��6�74��S�wFW�B׆��"�Bs�VW7F���5�7W'&V�E��VW7F��������F�b6�74��S�w76Rג�"s���v�F����r�v�F����"r�v�F����2r�v�F����Bu������B�����'WGF���W�׶�G�6�74��S�v&��6�r�gV���2&r�v��FR&�V�FVB&�&FW"FW�B��VgBr��6Ɩ6�҆7��2�������WB�46�"��E�u��F�WW$66R�����WB�Wu66�&R�66�&S���b��46�"���VW7F���5�7W'&V�E��6�'&V7E��7vW"���Wu66�&R�66�&R��6WE66�&R��Wu66�&R��Т�b�7W'&V�E��VW7F���2��V�wF��6WD7W'&V�E�������V�6R��6��7B&W2�v�B��6���WFT�W76��6V�V7FVD�W76���B�W6W"�B��Wu66�&R�VW7F���2��V�wF����6WEW6W"�R�������R���R��&W2�V&�VGҒ���6WD�7E��&W2�V&�VB���6WE&�w&W72��������6V�V7FVD�W76���Eғ��6WEf�Wr�w&W7V�Br���Т����46�'���VW7F���5�7W'&V�Eն�E����'WGF��⒗Т��F�c���F�c��Р��f�Ws���w&W7V�Brbb���F�b6�74��S�wFW�B�6V�FW"s�ƃ"6�74��S�wFW�B�7��f��B�&��B�"�BFW�B�&VBӃs��:�F�:����#���.��I:2G.�2��֒I;��r�7�6�74��S�vf��B�&��BFW�B�&VBӃs�66�&W���VW7F���2��V�wF����7��<:'R�����6�74��S�wFW�B�'��f��B�&��BFW�B�w&VV��c�B�Bs���7E�������'WGF��6�74��S�v�B�b&r�&VBӃFW�B�v��FR��B��"&�V�FVBr��6Ɩ6�҂����6WEf�Wr�v���Rr���n�G&�r6��s��'WGF�����F�c��Т��F�c�����