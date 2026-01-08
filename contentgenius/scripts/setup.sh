#!/bin/bash

echo "🚀 ContentGenius Setup Script"
echo "=============================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000"
echo ""
echo "For production deployment, see DEPLOYMENT.md"
