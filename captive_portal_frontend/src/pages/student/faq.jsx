import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/lib/mock-data";
import { Search, HelpCircle, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/auth";

const categories = ["All", "Connection", "Network", "Account", "Resources", "Support"];

export default function StudentFAQ() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredFaqs = faqItems.filter(item => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) || 
                          item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });
  useEffect(() => {
    const fetchFaqs = async () => {
      try { 
        const response = await apiClient().get("/api/faqs");
        console.log("Fetched FAQs:", response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20 md:pb-0 max-w-4xl mx-auto">
      <div className="text-center space-y-4 pt-4 pb-8 border-b border-border/50">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-display tracking-tight">How can we help?</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Find answers to common questions about connecting to the network and managing your portal account.</p>
        
        <div className="relative max-w-2xl mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search for answers..." 
            className="pl-12 h-14 rounded-full text-base bg-background shadow-sm border-border/60 focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <Badge 
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className={`px-4 py-1.5 text-sm cursor-pointer rounded-full transition-all ${
              activeCategory === cat 
                ? 'shadow-md shadow-primary/20' 
                : 'hover:bg-secondary bg-background border-border/50'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium mb-4 px-2">
          Showing {filteredFaqs.length} results
        </p>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No matching questions found.</p>
            <Button variant="link" onClick={() => {setSearch(''); setActiveCategory('All');}} className="mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          <Card className="glass-card border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b border-border/50 last:border-0 px-6">
                    <AccordionTrigger className="hover:no-underline text-left font-semibold text-base py-5 gap-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pr-12">
                      {faq.answer}
                      <div className="mt-4">
                        <Badge variant="secondary" className="text-xs bg-secondary/50 font-medium">
                          Category: {faq.category}
                        </Badge>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-md mt-12">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold font-display flex items-center gap-2 justify-center md:justify-start">
                <LifeBuoy className="w-6 h-6 text-primary" /> Still need help?
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                If you couldn't find the answer you were looking for, our IT support team is here to assist you.
              </p>
            </div>
            <Link href="/student/support" className="inline-block w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto shadow-sm">Open a Support Ticket</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
