/* Ponte nativa do Caderno Unirversos (Capacitor iOS / Android).
   Também blinda a experiência standalone (App Store / Google Play):
   - Ajusta StatusBar para o tema papel (#fdf6f4) com ícones escuros
   - Remove textos/botões de conta quando rodando offline-first sem login
   - Exporta backup (.json) usando compartilhamento nativo (@capacitor/filesystem + @capacitor/share)
   - Feedback tátil (Haptics) ao virar página, favoritar ou concluir flashcards
   - Botão Voltar físico no Android fecha painéis abertos antes de sair */
(function () {
  var Cap = window.Capacitor;
  var ehNativo = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var P = (Cap && Cap.Plugins) || {};

  /* 1. Em modo standalone sem login (V1 offline-first), evita texto/botão morto de "entrar na conta" */
  if (!window.UniConta) {
    function ajustarStatusOffline() {
      var est = document.querySelector('.cdu-e');
      if (est && /entre para guardar/i.test(est.textContent || '')) {
        est.textContent = 'Salvo neste aparelho (offline)';
      }
      var btEntrar = document.querySelector('[data-a="entrar"]');
      if (btEntrar) btEntrar.hidden = true;
    }
    var obs = new MutationObserver(ajustarStatusOffline);
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
    document.addEventListener('DOMContentLoaded', ajustarStatusOffline);
    setTimeout(ajustarStatusOffline, 100);
    setTimeout(ajustarStatusOffline, 900);
  }

  if (!ehNativo) return;

  /* 2. StatusBar com texto escuro sobre fundo claro (#fdf6f4) */
  try {
    if (P.StatusBar) {
      P.StatusBar.setStyle({ style: 'LIGHT' }).catch(function () {});
      if (P.StatusBar.setBackgroundColor) {
        P.StatusBar.setBackgroundColor({ color: '#fdf6f4' }).catch(function () {});
      }
    }
  } catch (e) {}

  /* 3. Haptics (feedback tátil leve) */
  function toqueLeve() {
    try {
      if (P.Haptics && P.Haptics.impact) P.Haptics.impact({ style: 'LIGHT' });
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.lv-nav button, .cdu-b.fav, [data-es="acertei"], [data-es="virar"], .lv-sem button');
    if (b && !b.disabled) toqueLeve();
  }, { passive: true });

  /* 4. Exportação de backup (.json) via Share Sheet nativo (funciona no iOS e Android) */
  function instalarBackupNativo() {
    var btExp = document.getElementById('bkp-exp');
    var msg = document.getElementById('cfg-msg');
    if (!btExp || !P.Share) return;

    function avisa(t) {
      if (!msg) return;
      msg.textContent = t;
      msg.hidden = false;
      setTimeout(function () { msg.hidden = true; }, 4500);
    }

    btExp.addEventListener('click', function (ev) {
      if (!window.UniCaderno || !window.UniCaderno.exportarBackup) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();

      var dados = window.UniCaderno.exportarBackup();
      var nome = 'caderno-unirversos-backup-' + new Date().toISOString().slice(0, 10) + '.json';

      if (P.Filesystem && P.Filesystem.writeFile) {
        P.Filesystem.writeFile({
          path: nome,
          data: dados,
          directory: 'CACHE',
          encoding: 'utf8'
        }).then(function (res) {
          return P.Share.share({
            title: 'Backup do Caderno Unirversos',
            text: 'Arquivo de backup das suas anotações do Caderno Unirversos.',
            url: res.uri,
            dialogTitle: 'Salvar ou enviar backup (.json)'
          });
        }).then(function () {
          avisa('✓ Backup pronto para salvar ou compartilhar!');
        }).catch(function (err) {
          if (err && /cancel/i.test(String(err.message || err))) return;
          avisa('Não foi possível compartilhar o backup agora.');
        });
      } else {
        P.Share.share({
          title: nome,
          text: dados,
          dialogTitle: 'Compartilhar backup (.json)'
        }).then(function () {
          avisa('✓ Backup compartilhado!');
        }).catch(function () {});
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instalarBackupNativo);
  } else {
    instalarBackupNativo();
  }

  /* 5. Botão Voltar físico do Android: fecha dicionário/dados antes de minimizar */
  try {
    if (P.App && P.App.addListener) {
      P.App.addListener('backButton', function () {
        var dic = document.getElementById('dicbox');
        if (dic && dic.classList.contains('on')) {
          var dicx = document.getElementById('dicx');
          if (dicx) dicx.click();
          return;
        }
        var cfg = document.getElementById('cfgbox');
        if (cfg && cfg.classList.contains('on')) {
          var cfgx = document.getElementById('cfgx');
          if (cfgx) cfgx.click();
          return;
        }
        if (P.App.minimizeApp) {
          P.App.minimizeApp();
        } else if (P.App.exitApp) {
          P.App.exitApp();
        }
      });
    }
  } catch (e) {}
})();
