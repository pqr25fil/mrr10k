import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                ContentGenius
              </span>
            </Link>
            <p className="mt-4 text-gray-500 max-w-md">
              AI-платформа для генерации контента. Создавайте тексты для блогов,
              социальных сетей, email-рассылок и рекламы за секунды.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Продукт</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-500 hover:text-violet-600 transition-colors"
                >
                  Тарифы
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-violet-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Поддержка</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@contentgenius.ai"
                  className="text-gray-500 hover:text-violet-600 transition-colors"
                >
                  support@contentgenius.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} ContentGenius. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
