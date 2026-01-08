import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Mail,
  ShoppingBag,
  FileText,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Статьи для блога",
    description:
      "Создавайте увлекательные статьи, которые привлекают читателей и повышают SEO",
  },
  {
    icon: MessageSquare,
    title: "Посты для соцсетей",
    description:
      "Генерируйте вирусный контент для Instagram, Twitter, LinkedIn и других платформ",
  },
  {
    icon: Mail,
    title: "Email-рассылки",
    description:
      "Пишите эффективные письма с высокой конверсией для ваших подписчиков",
  },
  {
    icon: ShoppingBag,
    title: "Описания товаров",
    description:
      "Создавайте продающие описания, которые превращают посетителей в покупателей",
  },
  {
    icon: Target,
    title: "Рекламные тексты",
    description:
      "Генерируйте цепляющие рекламные объявления для любых платформ",
  },
  {
    icon: TrendingUp,
    title: "SEO-контент",
    description:
      "Оптимизированные тексты, которые помогут вашему сайту подняться в поиске",
  },
];

const testimonials = [
  {
    name: "Анна Петрова",
    role: "SMM-менеджер",
    content:
      "ContentGenius экономит мне 10+ часов в неделю. Контент получается отличный, клиенты довольны!",
    rating: 5,
  },
  {
    name: "Дмитрий Козлов",
    role: "Владелец интернет-магазина",
    content:
      "Описания товаров теперь создаются за минуты, а не часы. Продажи выросли на 30%!",
    rating: 5,
  },
  {
    name: "Мария Сидорова",
    role: "Блогер",
    content:
      "Идеальный инструмент для преодоления писательского блока. Рекомендую всем контент-мейкерам!",
    rating: 5,
  },
];

const stats = [
  { value: "50K+", label: "Пользователей" },
  { value: "1M+", label: "Генераций" },
  { value: "99%", label: "Довольных клиентов" },
  { value: "24/7", label: "Поддержка" },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-200 opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-200 opacity-50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 mb-8">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Создавайте контент
              <span className="block mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                в 10 раз быстрее
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              AI-платформа для генерации качественного контента. Статьи, посты,
              email-рассылки, описания товаров и рекламные тексты — всё за секунды.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto group">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Посмотреть тарифы
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              5 бесплатных генераций каждый день. Без кредитной карты.
            </p>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none h-full" />
            <div className="relative mx-auto max-w-5xl rounded-2xl bg-white p-4 shadow-2xl shadow-violet-500/10 ring-1 ring-gray-100">
              <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-violet-500 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 h-10 rounded-lg bg-white shadow-sm flex items-center px-4 text-gray-400">
                      Напиши пост про запуск нового продукта...
                    </div>
                  </div>
                  <div className="ml-14 p-4 rounded-lg bg-white shadow-sm">
                    <p className="text-gray-700">
                      🚀 <strong>Большие новости!</strong> Мы рады представить наш
                      новый продукт, который изменит вашу жизнь...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Всё для вашего контента
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Создавайте любой тип контента с помощью AI. Быстро, качественно и
              без лишних усилий.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl bg-white p-8 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Как это работает
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Три простых шага до идеального контента
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Выберите тип контента",
                description:
                  "Укажите, что вам нужно: статья, пост, email или что-то другое",
              },
              {
                step: "02",
                title: "Опишите задачу",
                description:
                  "Напишите краткое описание того, о чём должен быть контент",
              },
              {
                step: "03",
                title: "Получите результат",
                description:
                  "AI создаст качественный текст за считанные секунды",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-violet-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Что говорят наши пользователи
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-8 shadow-lg shadow-gray-100/50"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">{testimonial.content}</p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Готовы создавать контент быстрее?
          </h2>
          <p className="mt-4 text-lg text-violet-100 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам маркетологов, блогеров и предпринимателей,
            которые уже используют ContentGenius
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-violet-600 hover:bg-violet-50"
              >
                Начать бесплатно
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-violet-200">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Бесплатный план</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Без кредитной карты</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Отмена в любое время</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
