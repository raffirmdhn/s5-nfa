<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Book Sales') - Book Sales API</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.5;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        header {
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.75rem 1.5rem;
        }

        .header-container {
            max-width: 960px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 1rem;
            list-style: none;
        }

        .nav-links a {
            text-decoration: none;
            color: #64748b;
            font-size: 0.95rem;
            font-weight: 500;
            padding: 0.4rem 0.75rem;
            border-radius: 6px;
            transition: color 0.15s, background-color 0.15s;
        }

        .nav-links a:hover {
            color: #0f172a;
            background-color: #f1f5f9;
        }

        .nav-links a.active {
            color: #0284c7;
            background-color: #e0f2fe;
            font-weight: 600;
        }

        main {
            flex: 1;
            max-width: 960px;
            width: 100%;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }

        .page-header {
            margin-bottom: 1.5rem;
        }

        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
        }

        .page-subtitle {
            font-size: 0.9rem;
            color: #64748b;
            margin-top: 0.25rem;
        }

        .table-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.925rem;
        }

        thead {
            background-color: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }

        th {
            padding: 0.85rem 1rem;
            font-weight: 600;
            color: #475569;
        }

        td {
            padding: 0.9rem 1rem;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background-color: #f8fafc;
        }

        .avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid #e2e8f0;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 4px;
            background-color: #f1f5f9;
            color: #334155;
        }

        footer {
            border-top: 1px solid #e2e8f0;
            background: #ffffff;
            text-align: center;
            padding: 1rem;
            font-size: 0.85rem;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-container">
            <a href="{{ route('books.index') }}" class="brand-title">BookSales API</a>
            <nav>
                <ul class="nav-links">
                    <li>
                        <a href="{{ route('books.index') }}" class="{{ request()->routeIs('books.index') ? 'active' : '' }}">Books</a>
                    </li>
                    <li>
                        <a href="{{ route('authors.index') }}" class="{{ request()->routeIs('authors.index') ? 'active' : '' }}">Authors</a>
                    </li>
                    <li>
                        <a href="{{ route('genres.index') }}" class="{{ request()->routeIs('genres.index') ? 'active' : '' }}">Genres</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        @yield('content')
    </main>

    <footer>
        <p>&copy; {{ date('Y') }} BookSales App - STT Terpadu Nurul Fikri</p>
    </footer>
</body>
</html>
