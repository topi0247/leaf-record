import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <article className="container my-8 leading-7">
      <h2 className="text-center text-3xl">プライバシーポリシー</h2>
      <p className="my-8">
        本サービスは
        <a
          href="https://docs.github.com/ja/site-policy/privacy-policies"
          target="_blank"
        >
          GitHubのプライバシーポリシー
        </a>
        に加え、以下のプライバシーポリシーを制定します。
      </p>
      <section className="my-8">
        <h3 className="text-xl mb-2">ユーザーから取得する情報</h3>
        <div className="ml-4">
          <p>
            Leaf
            Record～大草原不可避～運営（以下、運営）、ユーザーから以下の情報を取得します。
          </p>
          <ul className="list-disc ml-5">
            <li>氏名(ニックネームやペンネームも含む) メールアドレス</li>
            <li>
              外部サービスでユーザーが利用するID、その他外部サービスのプライバシー設定によりユーザーが連携先に開示を認めた情報
            </li>
            <li>Cookie(クッキー)を用いて生成された識別情報</li>
            <li>
              OSが生成するID、端末の種類、端末識別子等のユーザーが利用するOSや端末に関する情報
            </li>
          </ul>
        </div>
      </section>
      <section className="my-8">
        <h3 className="text-xl mb-2">ユーザーの情報を利用する目的</h3>
        <div className="ml-4">
          <p>
            運営は、ユーザーから取得した情報を、以下の目的のために利用します。
          </p>
          <ul className="list-disc ml-5">
            <li>
              本サービスに関する登録の受付、ユーザーの本人確認、認証のため
            </li>
            <li>
              本サービスにおけるユーザーの行動履歴を分析し、本サービスの維持改善に役立てるため
            </li>
            <li>ユーザーからのお問い合わせに対応するため</li>
            <li>本サービスの規約や法令に違反する行為に対応するため</li>
            <li>本サービスの変更、提供中止、終了、契約解除をご連絡するため</li>
            <li>運営規約の変更等を通知するため</li>
            <li>以上の他、本サービスの提供、維持、保護及び改善のため</li>
          </ul>
        </div>
      </section>
      <section className="my-8">
        <h3 className="text-xl mb-2">安全管理のために講じた措置</h3>
        <p className="ml-4">
          運営が、ユーザーから取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。
        </p>
      </section>
      <section className="my-8">
        <h3 className="text-xl mb-2">第三者提供</h3>
        <div className="ml-4">
          <p>
            運営は、ユーザーから取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめユーザーの同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。
            <br />
            但し、次の場合は除きます。 個人データの取扱いを外部に委託する場合
          </p>
          <ul className="list-disc ml-5">
            <li>運営や本サービスが買収された場合</li>
            <li>
              事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）
            </li>
            <li>その他、法律によって合法的に第三者提供が許されている場合</li>
          </ul>
        </div>
      </section>
      <section className="my-8">
        <h3 className="text-xl mb-2">アクセス解析ツール</h3>
        <div className="ml-4">
          <p>
            運営は、ユーザーのアクセス解析のために、「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。Googleアナリティクスについて、詳しくは以下からご確認ください。
          </p>
          <p>
            <a
              className="underline text-green-300"
              href="https://marketingplatform.google.com/about/analytics/terms/jp/"
              target="_blank"
            >
              https://marketingplatform.google.com/about/analytics/terms/jp/
            </a>
          </p>
        </div>
      </section>
      <section className="my-8">
        <h3 className="text-xl mb-2">プライバシーポリシーの変更</h3>
        <p className="ml-4">
          運営は、必要に応じて、このプライバシーポリシーの内容を変更します。この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により周知または通知します。
        </p>
      </section>
      <section className="my-8">
        <h3 className="text-xl mb-2">お問い合わせ</h3>
        <div className="ml-4">
          <p>
            ユーザーの情報の開示、情報の訂正、利用停止、削除をご希望の場合は、以下のお問合せフォームにご連絡ください。
          </p>
          <p>
            <Link href="contact" className="underline text-green-300">
              お問合せフォーム
            </Link>
          </p>
        </div>
      </section>
      <section className="my-8">
        <p>2024年04月25日 制定</p>
      </section>
    </article>
  );
}
