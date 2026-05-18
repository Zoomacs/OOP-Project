<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Q-Less Setup Checker</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0a0c10;
    --surface:  #111318;
    --border:   #1e2128;
    --border2:  #2a2f3a;
    --text:     #c9d1e0;
    --muted:    #525a6e;
    --pass:     #2dce7a;
    --pass-bg:  rgba(45,206,122,.08);
    --fail:     #ff4d6a;
    --fail-bg:  rgba(255,77,106,.08);
    --warn:     #f5a623;
    --warn-bg:  rgba(245,166,35,.08);
    --accent:   #4f8eff;
    --accent-bg:rgba(79,142,255,.1);
    --mono:     'IBM Plex Mono', monospace;
    --sans:     'IBM Plex Sans', sans-serif;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--sans); }

  /* ── SCANLINE overlay ── */
  body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.06) 2px, rgba(0,0,0,.06) 4px);
  }

  .shell {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 40px;
  }
  .logo-block { display: flex; flex-direction: column; gap: 6px; }
  .logo {
    font-family: var(--mono);
    font-size: 1.6rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -.5px;
  }
  .logo span { color: var(--fail); }
  .tagline {
    font-size: .78rem;
    color: var(--muted);
    font-family: var(--mono);
    letter-spacing: .04em;
  }
  .run-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 26px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-family: var(--mono);
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s, transform .1s;
  }
  .run-btn:hover  { background: #3a7aff; }
  .run-btn:active { transform: scale(.97); }
  .run-btn:disabled { background: var(--border2); color: var(--muted); cursor: not-allowed; }
  .run-btn .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    display: none;
  }
  .run-btn.loading .spinner { display: block; }
  .run-btn.loading .btn-label { display: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── PROGRESS BAR ── */
  .progress-track {
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    margin-bottom: 32px;
    overflow: hidden;
    opacity: 0;
    transition: opacity .3s;
  }
  .progress-track.visible { opacity: 1; }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--pass));
    border-radius: 2px;
    width: 0%;
    transition: width .35s ease;
  }

  /* ── SUMMARY BANNER ── */
  .summary {
    display: none;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 28px;
    font-family: var(--mono);
    font-size: .88rem;
    font-weight: 600;
    border: 1px solid;
  }
  .summary.visible { display: flex; align-items: center; gap: 12px; }
  .summary.all-pass { background: var(--pass-bg); border-color: rgba(45,206,122,.25); color: var(--pass); }
  .summary.has-fail { background: var(--fail-bg); border-color: rgba(255,77,106,.25); color: var(--fail); }

  /* ── SECTION ── */
  .section {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 16px;
    background: var(--surface);
  }
  .section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,.02);
  }
  .section-icon { font-size: 1rem; }
  .section-title {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--muted);
    font-family: var(--mono);
  }
  .section-count {
    margin-left: auto;
    font-family: var(--mono);
    font-size: .72rem;
    color: var(--muted);
  }

  /* ── ROW ── */
  .row {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 0 14px;
    align-items: start;
    padding: 13px 20px;
    border-bottom: 1px solid var(--border);
    transition: background .15s;
  }
  .row:last-child { border-bottom: none; }
  .row:hover { background: rgba(255,255,255,.015); }

  .row-icon {
    width: 26px; height: 26px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: .75rem;
    flex-shrink: 0;
    margin-top: 1px;
    background: var(--border);
    color: var(--muted);
    font-family: var(--mono);
    font-weight: 600;
    transition: all .25s;
  }
  .row-icon.pass { background: var(--pass-bg); color: var(--pass); border: 1px solid rgba(45,206,122,.3); }
  .row-icon.fail { background: var(--fail-bg); color: var(--fail); border: 1px solid rgba(255,77,106,.3); }
  .row-icon.spin-me { animation: spin .8s linear infinite; background: var(--accent-bg); color: var(--accent); }

  .row-body { min-width: 0; }
  .row-label { font-size: .88rem; font-weight: 600; color: var(--text); line-height: 1.3; }
  .row-detail {
    font-size: .76rem;
    font-family: var(--mono);
    margin-top: 3px;
    color: var(--muted);
  }
  .row-detail.ok   { color: var(--pass); }
  .row-detail.err  { color: var(--fail); }

  .fix-box {
    display: none;
    margin-top: 10px;
    padding: 12px 14px;
    background: rgba(255,77,106,.05);
    border: 1px solid rgba(255,77,106,.15);
    border-radius: 6px;
    font-size: .78rem;
    color: #b0b8cc;
    line-height: 1.6;
  }
  .fix-box.show { display: block; }
  .fix-box code {
    display: inline-block;
    background: #1a1d25;
    border: 1px solid var(--border2);
    padding: 1px 6px;
    border-radius: 3px;
    font-family: var(--mono);
    color: var(--warn);
    font-size: .76rem;
  }
  .fix-box pre {
    margin-top: 8px;
    padding: 10px 12px;
    background: #1a1d25;
    border: 1px solid var(--border2);
    border-radius: 4px;
    font-family: var(--mono);
    font-size: .74rem;
    color: var(--warn);
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
</head>
<body>
<?php
// ── This file goes in:  C:\xampp\htdocs\oop-project\backend\checker.php
// ── Open at:            http://localhost/oop-project/backend/checker.php
// ── It checks everything the Q-Less backend needs to work.

$DB_NAME = 'q-less_food_ordering_platform';
$DB_USER = 'root';
$DB_PASS = '';

// ── 1. PHP env ────────────────────────────────────────────────────────────────
$php_version = PHP_VERSION;
$php_ok      = version_compare($php_version, '7.4', '>=');
$mysqli_ok   = extension_loaded('mysqli');
$pdo_ok      = extension_loaded('pdo_mysql');
$json_ok     = extension_loaded('json');

// ── 2. DB connection ──────────────────────────────────────────────────────────
$db_conn   = false;
$db_exists = false;
$conn      = null;

$tables    = ['users','customers','restaurants','menus','product_items',
              'orders','shopping_carts','cart_items','deliveries','payments',
              'tickets','notifications','admins','restaurant_staff'];
$tbl_status = array_fill_keys($tables, false);

$admin_seeded = false;

try {
    $conn = new mysqli('localhost', $DB_USER, $DB_PASS);
    if (!$conn->connect_error) {
        $db_conn = true;
        $r = $conn->query("SHOW DATABASES LIKE '$DB_NAME'");
        if ($r && $r->num_rows > 0) {
            $db_exists = true;
            $conn->select_db($DB_NAME);

            foreach ($tables as $t) {
                $tr = $conn->query("SHOW TABLES LIKE '$t'");
                $tbl_status[$t] = ($tr && $tr->num_rows > 0);
            }

            if ($tbl_status['users']) {
                $ar = $conn->query("SELECT user_id FROM users WHERE type='admin' LIMIT 1");
                $admin_seeded = ($ar && $ar->num_rows > 0);

                // Check restaurants table has required columns
                $col_check = [];
                $cols_needed = ['reviews','prep_time','is_open','staff_delivery','image_url'];
                $cr = $conn->query("DESCRIBE restaurants");
                if ($cr) {
                    $existing_cols = [];
                    while ($col = $cr->fetch_assoc()) $existing_cols[] = $col['Field'];
                    foreach ($cols_needed as $cn) {
                        $col_check[$cn] = in_array($cn, $existing_cols);
                    }
                }
            }
        }
    }
} catch (Exception $e) {}

// ── 3. Files ──────────────────────────────────────────────────────────────────
$base = __DIR__;
$files = [
    'db.php'                          => $base . '/db.php',
    'api.php'                         => $base . '/api.php',
    'getRestaurants.php'              => $base . '/getRestaurants.php',
    'login.php'                       => $base . '/login.php',
    'register.php'                    => $base . '/register.php',
    'getMenu.php'                     => $base . '/getMenu.php',
    'tickets.php'                     => $base . '/tickets.php',
    'config/Database.php'             => $base . '/config/Database.php',
    'controllers/OrderController.php' => $base . '/controllers/OrderController.php',
    'controllers/UserController.php'  => $base . '/controllers/UserController.php',
    'controllers/RestaurantController.php' => $base . '/controllers/RestaurantController.php',
    'controllers/TicketController.php'=> $base . '/controllers/TicketController.php',
    'models/Order.php'                => $base . '/models/Order.php',
];
$file_status = [];
foreach ($files as $label => $path) {
    $file_status[$label] = file_exists($path);
}

// ── 4. Live API tests (self-referencing) ──────────────────────────────────────
function http_get($url) {
    // Try cURL first (works even when allow_url_fopen=Off)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>4,
            CURLOPT_FOLLOWLOCATION=>true, CURLOPT_SSL_VERIFYPEER=>false]);
        $body = curl_exec($ch); $err = curl_errno($ch); curl_close($ch);
        return ($err === 0 && $body !== false) ? $body : null;
    }
    $ctx = stream_context_create(['http' => ['timeout' => 4, 'ignore_errors' => true]]);
    $body = @file_get_contents($url, false, $ctx);
    return $body === false ? null : $body;
}
function http_post($url, $payload) {
    $json = json_encode($payload);
    // Try cURL first (works even when allow_url_fopen=Off)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>4,
            CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>$json,
            CURLOPT_HTTPHEADER=>['Content-Type: application/json','Content-Length: '.strlen($json)],
            CURLOPT_SSL_VERIFYPEER=>false]);
        $body = curl_exec($ch); $err = curl_errno($ch); curl_close($ch);
        return ($err === 0 && $body !== false) ? $body : null;
    }
    $ctx = stream_context_create(['http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n",
        'content' => $json,
        'timeout' => 4,
        'ignore_errors' => true,
    ]]);
    $body = @file_get_contents($url, false, $ctx);
    return $body === false ? null : $body;
}

// Normalize to forward slashes so the URL works on Windows (XAMPP) too
$_base_norm   = str_replace('\\', '/', $base);
$_docroot_norm = str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']);
$base_url = 'http://localhost' . str_replace($_docroot_norm, '', $_base_norm);

$test_restaurants = json_decode(http_get("$base_url/getRestaurants.php") ?? 'null', true);
$restaurants_ok   = is_array($test_restaurants);
$restaurants_count = $restaurants_ok ? count($test_restaurants) : 0;

$test_login_body   = http_post("$base_url/api.php?route=login", ['id'=>'admin','password'=>'admin123']);
$test_login        = json_decode($test_login_body ?? 'null', true);
$login_ok          = isset($test_login['success']) && $test_login['success'] === true;
$login_role        = $test_login['role'] ?? '—';

$test_ticket_body  = http_post("$base_url/api.php?route=tickets", ['title'=>'Checker test','message'=>'Automated check','user_email'=>'checker@test.com']);
$test_ticket       = json_decode($test_ticket_body ?? 'null', true);
$ticket_ok         = isset($test_ticket['success']) && $test_ticket['success'] === true;

// ── Pass counts ───────────────────────────────────────────────────────────────
$all_checks = array_merge(
    [$php_ok, $mysqli_ok, $pdo_ok, $json_ok, $db_conn, $db_exists],
    array_values($tbl_status),
    [$admin_seeded],
    array_values($file_status),
    [$restaurants_ok, $login_ok, $ticket_ok]
);
$total  = count($all_checks);
$passed = count(array_filter($all_checks));
$all_pass = ($passed === $total);
?>

<div class="shell">

  <div class="header">
    <div class="logo-block">
      <div class="logo">Q<span>-</span>Less Checker</div>
      <div class="tagline">// backend setup verification tool</div>
    </div>
    <button class="run-btn" id="runBtn" onclick="startAnim()">
      <div class="spinner"></div>
      <span class="btn-label">▶ Run Checks</span>
    </button>
  </div>

  <div class="progress-track" id="progressTrack">
    <div class="progress-fill" id="progressFill" style="width:<?= round($passed/$total*100) ?>%"></div>
  </div>

  <div class="summary <?= $all_pass ? 'all-pass' : 'has-fail' ?>" id="summary">
    <?= $all_pass
      ? '✓ All checks passed — backend is ready!'
      : "✗ $passed / $total checks passed — fix the red items below." ?>
  </div>

  <!-- ─── PHP Environment ──────────────────────────────────────────────── -->
  <div class="section">
    <div class="section-head">
      <span class="section-icon">⚙</span>
      <span class="section-title">PHP Environment</span>
      <span class="section-count"><?= ($php_ok+$mysqli_ok+$pdo_ok+$json_ok) ?>/4</span>
    </div>

    <?php row($php_ok, "PHP Version ≥ 7.4", "Running PHP $php_version", "Need PHP 7.4+. In XAMPP Control Panel → Config → PHP.ini and verify version."); ?>
    <?php row($mysqli_ok, "mysqli extension", $mysqli_ok ? "Loaded" : "Not loaded", "In XAMPP: php.ini → uncomment <code>extension=mysqli</code> → restart Apache."); ?>
    <?php row($pdo_ok,    "pdo_mysql extension", $pdo_ok ? "Loaded" : "Not loaded", "In XAMPP: php.ini → uncomment <code>extension=pdo_mysql</code> → restart Apache."); ?>
    <?php row($json_ok,   "json extension", $json_ok ? "Loaded" : "Not loaded", "In XAMPP: php.ini → uncomment <code>extension=json</code> → restart Apache."); ?>
  </div>

  <!-- ─── Database ─────────────────────────────────────────────────────── -->
  <?php
  $tables_passed = count(array_filter($tbl_status));
  $tables_total  = count($tbl_status);
  ?>
  <div class="section">
    <div class="section-head">
      <span class="section-icon">🗄</span>
      <span class="section-title">Database</span>
      <span class="section-count"><?= (int)$db_conn+(int)$db_exists+$tables_passed+(int)$admin_seeded ?>/<?= 2+$tables_total+1 ?></span>
    </div>

    <?php row($db_conn,   "MySQL connection (root / no password)",
      $db_conn ? "Connected" : "Cannot connect",
      "Open XAMPP Control Panel. Make sure MySQL shows <code>Running</code> (green). Then try again."); ?>

    <?php row($db_exists, "Database <code>q-less_food_ordering_platform</code> exists",
      $db_exists ? "Found" : "Not found",
      "In phpMyAdmin → click <b>New</b> → name it exactly <code>q-less_food_ordering_platform</code> → Create. Then run <code>full_schema.sql</code> from the SQL tab."); ?>

    <?php foreach ($tbl_status as $tbl => $ok):
      row($ok, "Table: <code>$tbl</code>", $ok ? "Exists" : "Missing",
        "Run <code>full_schema.sql</code> in phpMyAdmin → select the database → SQL tab → paste the file → Go.");
    endforeach; ?>

    <?php row($admin_seeded, "Admin user seeded in <code>users</code>",
      $admin_seeded ? "Admin user found" : "No admin user found",
      "Run this SQL in phpMyAdmin:
<pre>INSERT INTO users (name, type, email, university_id, password)
VALUES (
  'System Admin', 'admin', 'admin@qless.edu', 'admin',
  '\$2y\$10\$TKh8H1.PFyM9iFHGPKfCyuOSJADpxDNF9TnvgVIEQJOPdBbfX7P.i'
);
-- password is: admin123</pre>"); ?>
  </div>

  <!-- ─── File Check ────────────────────────────────────────────────────── -->
  <?php $files_passed = count(array_filter($file_status)); ?>
  <div class="section">
    <div class="section-head">
      <span class="section-icon">📁</span>
      <span class="section-title">Backend Files</span>
      <span class="section-count"><?= $files_passed ?>/<?= count($file_status) ?></span>
    </div>

    <?php foreach ($file_status as $label => $ok):
      row($ok, "<code>backend/$label</code>", $ok ? "Found" : "Missing",
        "Copy <code>$label</code> from the downloaded zip into <code>C:\\xampp\\htdocs\\oop-project\\backend\\" . str_replace('/','\\',$label) . "</code>");
    endforeach; ?>
  </div>

  <!-- ─── Live API Tests ────────────────────────────────────────────────── -->
  <div class="section">
    <div class="section-head">
      <span class="section-icon">🌐</span>
      <span class="section-title">Live API Tests</span>
      <span class="section-count"><?= (int)$restaurants_ok+(int)$login_ok+(int)$ticket_ok ?>/3</span>
    </div>

    <?php row($restaurants_ok,
      "GET getRestaurants.php returns JSON array",
      $restaurants_ok ? "$restaurants_count restaurant(s) returned" : "Bad response: " . substr(http_get("$base_url/getRestaurants.php") ?? "no response", 0, 80),
      "Insert at least one restaurant row, or run the seed in <code>full_schema.sql</code>. Also make sure <code>db.php</code> is present and correct."); ?>

    <?php row($login_ok,
      "POST api.php?route=login works for admin",
      $login_ok ? "Logged in — role: $login_role" : "Response: " . substr($test_login_body ?? "no response", 0, 80),
      "Seed the admin user first (see Database section above). The test uses <code>id=admin</code> / <code>password=admin123</code>."); ?>

    <?php row($ticket_ok,
      "POST api.php?route=tickets saves a ticket",
      $ticket_ok ? "Ticket saved successfully" : "Response: " . substr($test_ticket_body ?? "no response", 0, 80),
      "Make sure <code>tickets.php</code>, <code>TicketController.php</code>, and the <code>tickets</code> table all exist."); ?>
  </div>

</div><!-- /shell -->

<?php
// ── Helper: render one check row ─────────────────────────────────────────────
function row(bool $ok, string $label, string $detail, string $fix = '') {
    $state     = $ok ? 'pass' : 'fail';
    $icon      = $ok ? '✓' : '✗';
    $detail_cls = $ok ? 'ok' : 'err';
    $fix_cls   = (!$ok && $fix) ? 'show' : '';
    echo "
    <div class='row'>
      <div class='row-icon $state'>$icon</div>
      <div class='row-body'>
        <div class='row-label'>$label</div>
        <div class='row-detail $detail_cls'>$detail</div>"
        . ($fix ? "<div class='fix-box $fix_cls'>$fix</div>" : "") . "
      </div>
    </div>";
}
?>

<script>
// Animate progress bar + show summary on load, then hide run button since PHP already ran all checks
window.addEventListener('DOMContentLoaded', () => {
  const track   = document.getElementById('progressTrack');
  const fill    = document.getElementById('progressFill');
  const summary = document.getElementById('summary');
  const btn     = document.getElementById('runBtn');

  // Small delay so the animation is visible
  setTimeout(() => {
    track.classList.add('visible');
    summary.classList.add('visible');
    btn.textContent = '↺ Re-run (refresh)';
    btn.onclick = () => location.reload();
  }, 200);
});

function startAnim() {
  const btn = document.getElementById('runBtn');
  btn.classList.add('loading');
  btn.disabled = true;
  setTimeout(() => location.reload(), 300);
}
</script>
</body>
</html>