import { Button } from "../ui/button";
import { GoogleIcon } from "../../icons";
import { startGoogleAuth } from "../../lib/auth";
import { ui } from "../../lib/ui";

export function GoogleButton({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <div className={ui.divider} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">or</span>
        <div className={ui.divider} />
      </div>
      <Button
        type="button"
        variant="google"
        title={title}
        startIcon={<GoogleIcon />}
        fullWidth
        onClick={startGoogleAuth}
      />
    </div>
  );
}