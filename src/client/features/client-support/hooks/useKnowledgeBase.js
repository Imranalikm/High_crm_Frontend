import { useEffect, useMemo, useState } from 'react';
import { supportApi } from '../services/support.api';

export function useKnowledgeBase() {
  const [articles, setArticles]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    let active = true;
    Promise.all([
      supportApi.getKBArticles(),
      supportApi.getKBCategories(),
      supportApi.getFaqs(),
    ]).then(([arts, cats, faqData]) => {
      if (!active) return;
      setArticles(arts);
      setCategories(cats);
      setFaqs(faqData);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let rows = [...articles];
    if (activeCategory !== 'ALL') rows = rows.filter((a) => a.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((a) => a.title.toLowerCase().includes(q));
    }
    return rows;
  }, [articles, search, activeCategory]);

  return {
    articles: filtered, categories, faqs,
    loading, search, setSearch,
    activeCategory, setActiveCategory,
  };
}
