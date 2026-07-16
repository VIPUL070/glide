import { IDocument } from "@/models/Document.model";
import { ExternalLink, FileText } from "lucide-react";
import {motion} from "motion/react";

const DocsPreview = ({ partnerDocs }: { partnerDocs: IDocument }) => {
  return (
     <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 xl:col-span-2 xl:row-span-1 bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl">
                    <FileText className="w-6 h-6 " />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold ">
                      KYC Assets
                    </h3>
                    <p className="text-xs">
                      Verifiable external parameters
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      Identity File
                    </span>
                    <h4 className="text-sm font-bold  mt-0.5">
                      Aadhar Card
                    </h4>
                  </div>
                  <a
                    href={partnerDocs.aadharUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-center gap-1.5 text-neutral-700 hover:bg-neutral-100 transition-colors shadow-sm"
                  >
                    View Vault <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      Permit Asset
                    </span>
                    <h4 className="text-sm font-bold  mt-0.5">
                      Driving License
                    </h4>
                  </div>
                  <a
                    href={partnerDocs.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-center gap-1.5 text-neutral-700 hover:bg-neutral-100 transition-colors shadow-sm"
                  >
                    View Vault <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      Ownership Proof
                    </span>
                    <h4 className="text-sm font-bold  mt-0.5">
                      RC Document
                    </h4>
                  </div>
                  <a
                    href={partnerDocs.rcUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-center gap-1.5 text-neutral-700 hover:bg-neutral-100 transition-colors shadow-sm"
                  >
                    View Vault <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs ">
              <span>All assets are hosted within secure end-point CDNs.</span>
            </div>
          </motion.div>
  )
}

export default DocsPreview;