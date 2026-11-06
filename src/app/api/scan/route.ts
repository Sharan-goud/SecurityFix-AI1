import { NextResponse } from 'next/server';
import {
  parsePackageJson,
  parsePackageLockJson,
  parseRequirementsTxt,
  scanDependenciesWithOSV,
} from '@/lib/osv';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, content, ecosystem } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'File content is required for scanning' },
        { status: 400 }
      );
    }

    let deps: any[] = [];
    const lowerName = (filename || '').toLowerCase();

    if (lowerName.endsWith('package-lock.json')) {
      deps = parsePackageLockJson(content);
    } else if (lowerName.endsWith('package.json')) {
      deps = parsePackageJson(content);
    } else if (lowerName.endsWith('requirements.txt')) {
      deps = parseRequirementsTxt(content);
    } else {
      if (content.trim().startsWith('{')) {
        deps = parsePackageJson(content);
      } else {
        deps = parseRequirementsTxt(content);
      }
    }

    const vulnerabilities = await scanDependenciesWithOSV(deps);

    return NextResponse.json({
      success: true,
      dependenciesCount: deps.length,
      vulnerabilitiesCount: vulnerabilities.length,
      vulnerabilities,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to execute dependency scan' },
      { status: 500 }
    );
  }
}

