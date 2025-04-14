// import prisma from "../../utils/db"
import {prisma} from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"

interface ContentIdea {
  id: number;
  title: string;
  description: string;
}

// Templates for different business types
const IDEA_TEMPLATES: { [key: string]: string[] } = {
  Restaurant: [
    "Top 5 {{ season }} dishes in {{ location }}",
    "Behind the scenes: How we source ingredients in {{ location }}",
    "Meet the chef: The story behind our {{ signature_dish }}",
    "{{ holiday }} special menu preview",
    "Local food trends in {{ location }} for {{ year }}"
  ],
  Cafe: [
    "Introducing our new {{ season }} blend from {{ location }}",
    "Coffee brewing tips from our baristas",
    "Pastry pairing guide for your morning coffee",
    "How to make our famous {{ signature_item }} at home",
    "{{ location }}'s coffee culture: What makes us unique"
  ],
  Salon: [
    "{{ season }} hair trends in {{ location }}",
    "Before & After: {{ treatment }} transformations",
    "Meet our stylists: {{ stylist_name }}'s journey",
    "Product spotlight: Why we use {{ product }} for {{ treatment }}",
    "{{ location }}'s most requested hairstyles this {{ season }}"
  ],
  default: [
    "Seasonal update: What's new at our {{ business_type }} in {{ location }}",
    "Customer spotlight: Meet our regulars",
    "Behind the scenes: A day in our {{ business_type }}",
    "{{ location }} community events we're participating in",
    "Special promotion: {{ offer_details }} this {{ season }}"
  ]
};

// Generate ideas based on business type and location
function generateIdeas(businessType: string, location: string): ContentIdea[] {
  const templates = IDEA_TEMPLATES[businessType] || IDEA_TEMPLATES.default;
  
  const currentDate = new Date();
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  const currentSeason = seasons[Math.floor((currentDate.getMonth() / 12) * 4) % 4];
  const currentYear = currentDate.getFullYear();
  
  // Holiday logic based on current month
  const month = currentDate.getMonth();
  let nearestHoliday = "Holiday";
  if (month >= 0 && month < 2) nearestHoliday = "Valentine's Day";
  else if (month >= 2 && month < 5) nearestHoliday = "Easter";
  else if (month >= 5 && month < 8) nearestHoliday = "Summer Holiday";
  else if (month >= 8 && month < 10) nearestHoliday = "Halloween";
  else nearestHoliday = "Christmas";
  
  // Business-specific placeholders
  const businessDetails: any = {
    Restaurant: {
      signature_dish: ["Pasta Primavera", "Grilled Salmon", "Steak", "House Burger"][Math.floor(Math.random() * 4)]
    },
    Cafe: {
      signature_item: ["Latte Art", "Croissant", "Cold Brew", "Espresso Shot"][Math.floor(Math.random() * 4)]
    },
    Salon: {
      treatment: ["Color", "Balayage", "Keratin", "Cut and Style"][Math.floor(Math.random() * 4)],
      stylist_name: ["Alex", "Jamie", "Taylor", "Jordan"][Math.floor(Math.random() * 4)],
      product: ["Olaplex", "Redken", "Aveda", "Kerastase"][Math.floor(Math.random() * 4)]
    },
    default: {
      offer_details: ["10% off", "Buy one get one free", "Free consultation", "Member exclusive"][Math.floor(Math.random() * 4)]
    }
  };
  
  // Generate descriptions for each idea
  const descriptionTemplates = [
    "Great for increasing engagement and showcasing your expertise",
    "Perfect for highlighting your unique offerings in {{ location }}",
    "Customers love this type of content - great for shares and saves",
    "Builds community connection and shows your local roots",
    "Timely content that capitalizes on {{ season }} interest"
  ];
  
  // Fill in templates with appropriate values
  return templates.map((template: string, index: number): ContentIdea => {
    // Replace placeholders in template with values
    let title = template
      .replace('{{ location }}', location)
      .replace('{{ season }}', currentSeason)
      .replace('{{ year }}', currentYear.toString())
      .replace('{{ holiday }}', nearestHoliday)
      .replace('{{ business_type }}', businessType);
    
    // Replace business-specific placeholders
    const specificDetails = businessDetails[businessType] || businessDetails.default;
    for (const [key, value] of Object.entries(specificDetails)) {
      title = title.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), value as string);
    }
    
    // Create description with similar replacements
    let description = descriptionTemplates[index % descriptionTemplates.length]
      .replace('{{ location }}', location)
      .replace('{{ season }}', currentSeason);
    
    return {
      id: index + 1,
      title,
      description
    };
  });
}

export async function POST(req: NextRequest) {
  console.log('POST /api/ideas route handler called');
  
  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const { businessType, location, userId, idea } = body;
    
    // If userId and idea are provided, save to database
    if (userId && idea) {
      console.log('Creating new idea in database');
      const newIdea = await prisma.idea.create({
        data:{
          userId,
          idea
        }
      });
      
      return NextResponse.json({
        message: "Idea created successfully",
        idea: newIdea
      });
    }
    
    // If businessType and location are provided, generate ideas
    if (businessType && location) {
      console.log('Generating ideas for', businessType, 'in', location);
      const generatedIdeas = generateIdeas(businessType, location);
      
      return NextResponse.json({
        ideas: generatedIdeas
      });
    }
    
    console.log('Invalid request parameters');
    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error in ideas API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}